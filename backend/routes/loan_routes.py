"""
Loan Application and Prediction Routes
"""
import os
import json
import joblib
import numpy as np
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, User, LoanApplication, Document

loan_bp = Blueprint('loan', __name__)


def load_model():
    model_path = current_app.config['MODEL_PATH']
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None


def generate_suggestions(data, probability):
    """Generate improvement suggestions based on application data."""
    suggestions = []

    credit_history = int(data.get('credit_history', 1))
    cibil = int(data.get('cibil_score', 700))
    income = float(data.get('applicant_income', 0))
    loan_amount = float(data.get('loan_amount', 0))
    coapplicant = float(data.get('coapplicant_income', 0))
    existing_debts = float(data.get('existing_debts', 0))
    emi = float(data.get('existing_emi', 0))

    if credit_history == 0:
        suggestions.append("✦ Maintain a clean credit history — pay all existing EMIs and loans on time.")
    if cibil < 650:
        suggestions.append(f"✦ Improve your CIBIL score (currently {cibil}) to at least 700 for better eligibility.")
    if income > 0 and loan_amount / income > 5:
        suggestions.append("✦ Consider reducing your loan amount relative to your income.")
    if coapplicant == 0:
        suggestions.append("✦ Adding a co-applicant with income can significantly improve your chances.")
    if existing_debts > income * 0.4:
        suggestions.append("✦ Reduce existing debts before applying — your debt-to-income ratio is high.")
    if emi > income * 0.3:
        suggestions.append("✦ Your existing EMIs are high. Try to close some before applying.")
    if probability < 0.5:
        suggestions.append("✦ Consider applying for a smaller loan amount.")
        suggestions.append("✦ Provide complete income documentation and bank statements.")

    if not suggestions:
        suggestions.append("✦ Your profile looks strong! Ensure all documents are up to date.")

    return suggestions


@loan_bp.route('/apply', methods=['POST'])
@jwt_required()
def apply_loan():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Create loan application
    app_obj = LoanApplication(
        user_id=int(user_id),
        loan_type=data.get('loan_type', ''),
        purpose=data.get('purpose', ''),
        full_name=data.get('full_name', ''),
        age=data.get('age'),
        gender=data.get('gender', ''),
        marital_status=data.get('marital_status', ''),
        education=data.get('education', ''),
        dependents=str(data.get('dependents', '0')),
        employment_type=data.get('employment_type', ''),
        address=data.get('address', ''),
        pan_number=data.get('pan_number', ''),
        aadhaar_number=data.get('aadhaar_number', ''),
        applicant_income=data.get('applicant_income', 0),
        coapplicant_income=data.get('coapplicant_income', 0),
        monthly_salary=data.get('monthly_salary', 0),
        existing_emi=data.get('existing_emi', 0),
        credit_score=data.get('credit_score', 0),
        bank_balance=data.get('bank_balance', 0),
        loan_amount=data.get('loan_amount', 0),
        loan_amount_term=data.get('loan_amount_term', 360),
        cibil_score=data.get('cibil_score', 0),
        existing_debts=data.get('existing_debts', 0),
        credit_history=data.get('credit_history', 1),
        property_area=data.get('property_area', 'Urban'),
        self_employed=data.get('self_employed', 'No'),
        status='Pending'
    )
    db.session.add(app_obj)
    db.session.commit()

    return jsonify({
        'message': 'Application submitted',
        'application_id': app_obj.id,
        'application': app_obj.to_dict()
    }), 201


@loan_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    application_id = data.get('application_id')
    app_obj = None
    if application_id:
        app_obj = LoanApplication.query.filter_by(
            id=application_id, user_id=int(user_id)).first()

    try:
        # Import here to avoid circular import
        import sys
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from ml.preprocess import preprocess_single_input

        input_data = {
            'gender': data.get('gender', 'Male'),
            'married': data.get('marital_status', 'No'),
            'dependents': str(data.get('dependents', '0')),
            'education': data.get('education', 'Graduate'),
            'self_employed': data.get('self_employed', 'No'),
            'applicant_income': float(data.get('applicant_income', 0)),
            'coapplicant_income': float(data.get('coapplicant_income', 0)),
            'loan_amount': float(data.get('loan_amount', 100)),
            'loan_amount_term': float(data.get('loan_amount_term', 360)),
            'credit_history': float(data.get('credit_history', 1)),
            'property_area': data.get('property_area', 'Urban')
        }

        model = load_model()
        if model is None:
            # Fallback: rule-based prediction when model not trained yet
            score = 0
            if input_data['credit_history'] == 1: score += 40
            if float(input_data['applicant_income']) > 4000: score += 20
            if input_data['education'] == 'Graduate': score += 15
            if input_data['married'] == 'Yes': score += 10
            cibil = int(data.get('cibil_score', 700))
            if cibil >= 700: score += 15
            probability = score / 100.0
        else:
            X = preprocess_single_input(input_data)
            prob_arr = model.predict_proba(X)[0]
            probability = float(prob_arr[1])  # probability of being eligible

        eligible = probability >= 0.5
        status = 'Eligible' if eligible else 'Not Eligible'
        suggestions = generate_suggestions(data, probability)

        # Update application if linked
        if app_obj:
            app_obj.status = status
            app_obj.prediction_probability = probability
            app_obj.suggestions = json.dumps(suggestions)
            db.session.commit()

        return jsonify({
            'status': status,
            'eligible': eligible,
            'probability': round(probability * 100, 2),
            'suggestions': suggestions,
            'application_id': application_id
        }), 200

    except Exception as e:
        current_app.logger.error(f"Prediction error: {e}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@loan_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    apps = LoanApplication.query.filter_by(user_id=int(user_id))\
        .order_by(LoanApplication.created_at.desc()).all()

    result = []
    for app_obj in apps:
        app_dict = app_obj.to_dict()
        # Add documents
        docs = Document.query.filter_by(application_id=app_obj.id).first()
        app_dict['documents'] = docs.to_dict() if docs else None
        # Parse suggestions
        if app_dict.get('suggestions'):
            try:
                app_dict['suggestions'] = json.loads(app_dict['suggestions'])
            except Exception:
                pass
        result.append(app_dict)

    return jsonify({'applications': result}), 200


@loan_bp.route('/application/<int:app_id>', methods=['GET'])
@jwt_required()
def get_application(app_id):
    user_id = get_jwt_identity()
    app_obj = LoanApplication.query.filter_by(
        id=app_id, user_id=int(user_id)).first()
    if not app_obj:
        return jsonify({'error': 'Application not found'}), 404

    app_dict = app_obj.to_dict()
    docs = Document.query.filter_by(application_id=app_id).first()
    app_dict['documents'] = docs.to_dict() if docs else None
    if app_dict.get('suggestions'):
        try:
            app_dict['suggestions'] = json.loads(app_dict['suggestions'])
        except Exception:
            pass

    return jsonify({'application': app_dict}), 200
