"""
Database Models for Loan Eligibility App
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    applications = db.relationship('LoanApplication', backref='user', lazy=True)
    documents = db.relationship('Document', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'mobile': self.mobile,
            'created_at': self.created_at.isoformat()
        }


class LoanApplication(db.Model):
    __tablename__ = 'loan_applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Loan details
    loan_type = db.Column(db.String(50))
    purpose = db.Column(db.String(200))

    # Personal details
    full_name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    marital_status = db.Column(db.String(20))
    education = db.Column(db.String(20))
    dependents = db.Column(db.String(5))
    employment_type = db.Column(db.String(50))
    address = db.Column(db.Text)
    pan_number = db.Column(db.String(10))
    aadhaar_number = db.Column(db.String(12))

    # Financial details
    applicant_income = db.Column(db.Float)
    coapplicant_income = db.Column(db.Float, default=0)
    monthly_salary = db.Column(db.Float)
    existing_emi = db.Column(db.Float, default=0)
    credit_score = db.Column(db.Integer)
    bank_balance = db.Column(db.Float)
    loan_amount = db.Column(db.Float)
    loan_amount_term = db.Column(db.Integer)
    cibil_score = db.Column(db.Integer)
    existing_debts = db.Column(db.Float, default=0)
    credit_history = db.Column(db.Integer, default=1)
    property_area = db.Column(db.String(20))
    self_employed = db.Column(db.String(5))

    # Prediction result
    status = db.Column(db.String(20), default='Pending')  # Eligible / Not Eligible / Pending
    prediction_probability = db.Column(db.Float)
    suggestions = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    documents = db.relationship('Document', backref='application', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'loan_type': self.loan_type,
            'purpose': self.purpose,
            'full_name': self.full_name,
            'age': self.age,
            'gender': self.gender,
            'marital_status': self.marital_status,
            'education': self.education,
            'dependents': self.dependents,
            'employment_type': self.employment_type,
            'applicant_income': self.applicant_income,
            'coapplicant_income': self.coapplicant_income,
            'loan_amount': self.loan_amount,
            'loan_amount_term': self.loan_amount_term,
            'credit_score': self.credit_score,
            'cibil_score': self.cibil_score,
            'bank_balance': self.bank_balance,
            'property_area': self.property_area,
            'self_employed': self.self_employed,
            'status': self.status,
            'prediction_probability': self.prediction_probability,
            'suggestions': self.suggestions,
            'created_at': self.created_at.isoformat()
        }


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    application_id = db.Column(db.Integer, db.ForeignKey('loan_applications.id'), nullable=True)

    pan_file = db.Column(db.String(255))
    aadhaar_file = db.Column(db.String(255))
    salary_file = db.Column(db.String(255))
    bank_statement_file = db.Column(db.String(255))
    property_file = db.Column(db.String(255))
    gold_file = db.Column(db.String(255))
    student_proof_file = db.Column(db.String(255))

    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'application_id': self.application_id,
            'pan_file': self.pan_file,
            'aadhaar_file': self.aadhaar_file,
            'salary_file': self.salary_file,
            'bank_statement_file': self.bank_statement_file,
            'property_file': self.property_file,
            'gold_file': self.gold_file,
            'student_proof_file': self.student_proof_file,
            'uploaded_at': self.uploaded_at.isoformat()
        }
