from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.model.user import User
from app import db, app
import datetime
from flask_jwt_extended import JWTManager, create_access_token

jwt = JWTManager()

def setup_jwt(app):
    app.config['JWT_SECRET_KEY'] = 'secret'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
    jwt.init_app(app)


def generate_access_token(identity):
    return create_access_token(identity=identity)

setup_jwt(app)

class AuthController:

    @staticmethod
    def register():
        data = request.get_json()
        
        # Memeriksa kelengkapan data JSON
        if not data or not all(key in data for key in ('nik', 'email', 'password', 'nama')):
            return jsonify({'message': 'Missing data!'}), 400

        # Menghasilkan hash kata sandi
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        # Membuat objek User baru
        new_user = User(
            nik=data['nik'],
            email=data['email'],
            password=hashed_password,
            role='user',
            nama=data['nama']
        )

        # Menambahkan dan menyimpan pengguna baru ke database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Registered successfully!'}), 201

    @staticmethod
    def login():
        data = request.get_json()
        
        # Memeriksa kelengkapan data JSON
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Could not verify', 'error': 'Missing credentials!'}), 401

        # Mencari pengguna berdasarkan alamat email
        user = User.query.filter_by(email=data['email']).first()

        # Memeriksa keberadaan pengguna dan kecocokan kata sandi
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'message': 'Could not verify', 'error': 'Invalid credentials!'}), 401

        token = create_access_token(identity=user.id)

        return jsonify(
            access_token=token,
            id=user.id,
            nik=user.nik,
            email=user.email,
            role=user.role,
            nama=user.nama
        ), 200