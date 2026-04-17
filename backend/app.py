"""
Loan Eligibility Prediction App - Flask Backend
Main application entry point
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True)
    JWTManager(app)
    db.init_app(app)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.loan_routes import loan_bp
    from routes.upload_routes import upload_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(loan_bp, url_prefix='/api/loan')
    app.register_blueprint(upload_bp, url_prefix='/api')

    # Health check
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'message': 'Loan Eligibility API running'}), 200

    # JWT error handlers
    from flask_jwt_extended import exceptions as jwt_exceptions
    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'error': 'Unauthorized. Please login.'}), 401

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    # Create DB tables
    with app.app_context():
        db.create_all()
        print("✅ Database tables created")

    return app


app = create_app()

if __name__ == '__main__':
    print("🚀 Starting Loan Eligibility API server...")
    print("📍 API running at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
