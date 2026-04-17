"""
Flask Application Configuration
"""
import os
from datetime import timedelta


class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'loan-app-secret-key-2024-change-in-production')
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'

    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-loan-secret-2024-change-me')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Database - SQLite for easy setup (swap with MySQL URI if needed)
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(BASE_DIR, 'loan_app.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # File Uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}

    # ML Model
    MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'model.pkl')
    ENCODERS_PATH = os.path.join(BASE_DIR, 'ml', 'encoders.pkl')
    SCALER_PATH = os.path.join(BASE_DIR, 'ml', 'scaler.pkl')

    # MySQL (alternative - set DATABASE_URL env var)
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://user:password@localhost/loan_db"
