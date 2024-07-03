from app.controller.auth_controller import AuthController
from app.controller.admin_controller import AdminController
from app.controller.user_controller import UserController
from app.model.user import User
from app import db, app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from flask import send_from_directory
from flask_cors import cross_origin

@app.route('/register', methods=['POST'])
def register():
    return AuthController.register()

@app.route('/api/login', methods=['POST'])
def login():
    return AuthController.login()

@app.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    return AdminController.get_dashboard_data()

@app.route('/admin/program-bantuan', methods=['GET'])
@jwt_required()
def program_bantuan():
    return AdminController.get_data_program_bantuan()

@app.route('/admin/verifikasi-penerima', methods=['GET'])
@jwt_required()
def verifikasi_penerima_manfaat():
    return AdminController.get_data_verifikasi_penerima_manfaat()

@app.route('/admin/penerima-manfaat', methods=['GET'])
@jwt_required()
def penerima_manfaat():
    return AdminController.get_data_penerima_manfaat()

@app.route('/admin/jadwal-penyaluran', methods=['GET'])
@jwt_required()
def jadwal_penyaluran():
    return AdminController.get_data_penyaluran_bantuan()

## CREATE
@app.route('/admin/program-bantuan/tambah', methods=['POST'])
@jwt_required()
def create_jenis_bantuan():
    return AdminController.create_jenis_bantuan()

@app.route('/admin/jadwal-penyaluran/tambah', methods=['POST'])
@jwt_required()
def create_jadwal_penyaluran():
    return AdminController.create_penyaluran_bantuan()



## UPDATE
@app.route('/admin/program-bantuan/update/<string:id>', methods=['PUT'])
@jwt_required()
def update_jenis_bantuan(id):
    return AdminController.update_jenis_bantuan(id)

@app.route('/admin/verifikasi-penerima-manfaat/update/<string:id>', methods=['PUT'])
@jwt_required()
def update_verifikasi_penerima_manfaat(id):
    return AdminController.update_status_penerima_manfaat(id)

@app.route('/admin/jadwal-penyaluran/update/<string:id>', methods=['PUT'])
@jwt_required()
def update_jadwal_penyaluran(id):
    return AdminController.update_penyaluran_bantuan(id)



##USER

@app.route('/user/dashboard/<string:id>', methods=['GET'])
@jwt_required()
def user_dashboard(id):
    return UserController.get_dashboard_data(id)

@app.route('/user/lihat-program/<string:id>', methods=['GET'])
@jwt_required()
def user_lihat_program(id):
    return UserController.get_lihat_program(id)

@app.route('/user/profile/<string:id>', methods=['GET'])
@jwt_required()
def user_profile(id):
    return UserController.get_profile(id)

@app.route('/user/profile/update/<string:id>', methods=['POST'])
@jwt_required()
def update_profile(id):
    return UserController.post_profile(id)

@app.route('/user/daftar-penerima-manfaat/tambah/<string:id>', methods=['POST'])
@jwt_required()
def post_penerima_manfaat(id):
    return UserController.post_penerima_manfaat(id)

@app.route('/user/daftar-penerima-manfaat/update/<string:id>', methods=['PUT'])
@jwt_required()
def update_penerima_manfaat(id):
    return UserController.update_penerima_manfaat(id)

@app.route('/user/daftar-penerima-manfaat/delete/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_penerima_manfaat(id):
    return UserController.delete_penerima_manfaat(id)

@app.route('/user/daftar-penerima-manfaat/ajukan-ulang/<string:id>', methods=['PUT'])
@jwt_required()
def ajukan_ulang_penerima_manfaat(id):
    return UserController.ajukan_ulang_penerima_manfaat(id)

@app.route('/user/jadwal-penyaluran/<string:id>', methods=['GET'])
@jwt_required()
def user_jadwal_penyaluran(id):
    return UserController.get_data_jadwal_penyaluran(id)

@app.route('/user/jadwal_penyaluran/update/<string:id>', methods=['PUT'])
@jwt_required()
def update_status_jadwal_penyaluran(id):
    return UserController.update_status_jadwal_penyaluran(id)

@app.route('/upload', methods=['POST'])
def upload_file():
    return UserController.upload_file()



@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'nik': user.nik,
        'email': user.email,
        'nama': user.nama,
        'role': user.role
    }), 200

@app.route('/uploads/<filename>')
@cross_origin()  # Jika menggunakan flask_cors
def uploaded_file(filename):
    response = send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    response.headers['Access-Control-Allow-Origin'] = '*'  # Atau origin spesifik
    return response