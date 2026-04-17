"""
Document Upload Routes
"""
import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models.models import db, Document

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}
DOC_FIELDS = ['pan_file', 'aadhaar_file', 'salary_file',
              'bank_statement_file', 'property_file', 'gold_file', 'student_proof_file']


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_file(file, user_id, doc_type):
    """Save uploaded file and return relative path."""
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_name = f"{user_id}_{doc_type}_{uuid.uuid4().hex[:8]}.{ext}"
        user_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], str(user_id))
        os.makedirs(user_folder, exist_ok=True)
        filepath = os.path.join(user_folder, unique_name)
        file.save(filepath)
        return os.path.join(str(user_id), unique_name)
    return None


@upload_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_documents():
    user_id = get_jwt_identity()
    application_id = request.form.get('application_id')

    # Find or create document record
    doc = None
    if application_id:
        doc = Document.query.filter_by(
            user_id=int(user_id), application_id=int(application_id)).first()
    if not doc:
        doc = Document(user_id=int(user_id),
                       application_id=int(application_id) if application_id else None)
        db.session.add(doc)

    uploaded = []
    errors = []

    field_map = {
        'pan_file': 'pan',
        'aadhaar_file': 'aadhaar',
        'salary_file': 'salary',
        'bank_statement_file': 'bank_statement',
        'property_file': 'property',
        'gold_file': 'gold',
        'student_proof_file': 'student_proof'
    }

    for field, doc_type in field_map.items():
        if field in request.files:
            file = request.files[field]
            if file.filename:
                # Check file size (10MB max)
                file.seek(0, 2)
                size = file.tell()
                file.seek(0)
                if size > 10 * 1024 * 1024:
                    errors.append(f"{field}: File too large (max 10MB)")
                    continue
                path = save_file(file, user_id, doc_type)
                if path:
                    setattr(doc, field, path)
                    uploaded.append(field)
                else:
                    errors.append(f"{field}: Invalid file type (PDF, JPG, PNG only)")

    db.session.commit()

    return jsonify({
        'message': f'Uploaded {len(uploaded)} document(s)',
        'uploaded': uploaded,
        'errors': errors,
        'document': doc.to_dict()
    }), 200


@upload_bp.route('/documents', methods=['GET'])
@jwt_required()
def get_documents():
    user_id = get_jwt_identity()
    application_id = request.args.get('application_id')

    query = Document.query.filter_by(user_id=int(user_id))
    if application_id:
        query = query.filter_by(application_id=int(application_id))

    docs = query.all()
    return jsonify({'documents': [d.to_dict() for d in docs]}), 200
