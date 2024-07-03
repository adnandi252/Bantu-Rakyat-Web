from flask import jsonify, request
from app.model.penerima_manfaat import PenerimaManfaat
from app.model.jenis_bantuan import JenisBantuan
from app.model.jadwal_penyaluran import JadwalPenyaluran
from app.model.user import User
from app.model.profile import Profile
from app import db
from sqlalchemy.sql import func, or_
from werkzeug.utils import secure_filename
import os
from app import app
from sqlalchemy.orm import joinedload


class UserController:
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    @staticmethod
    def upload_file():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            return jsonify({'fileUrl': f'/uploads/{filename}'}), 200
    
    @staticmethod
    def get_dashboard_data(id):
        total_packages = db.session.query(
            func.count(JadwalPenyaluran.id).label('total')
        ).join(PenerimaManfaat, JadwalPenyaluran.penerimaManfaatId == PenerimaManfaat.id) \
        .join(JenisBantuan, PenerimaManfaat.jenisBantuanId == JenisBantuan.id) \
        .filter(PenerimaManfaat.userId == id) \
        .filter(JadwalPenyaluran.status == 'selesai') \
        .scalar()

        jenis_bantuan_counts = db.session.query(
            JenisBantuan.nama_bantuan,
            func.count(JadwalPenyaluran.id).label('count')
        ).outerjoin(
            PenerimaManfaat,
            PenerimaManfaat.jenisBantuanId == JenisBantuan.id
        ).outerjoin(
            JadwalPenyaluran,
            (JadwalPenyaluran.penerimaManfaatId == PenerimaManfaat.id) & (JadwalPenyaluran.status == 'selesai')
        ).filter(
            PenerimaManfaat.userId == id
        ).filter(
            or_(PenerimaManfaat.status == 'aktif', PenerimaManfaat.status == 'nonaktif')
        ).group_by(
            JenisBantuan.nama_bantuan
        ).all()

        jenis_bantuan_data = {bantuan.nama_bantuan: bantuan.count for bantuan in jenis_bantuan_counts}

        return jsonify({
            'user_id': id,
            'total_packages': total_packages,
            'jenis_bantuan': jenis_bantuan_data
        })
    
    @staticmethod
    def get_lihat_program(id):
        programs = JenisBantuan.query.filter_by(status='aktif').all()
        penerima_manfaat = PenerimaManfaat.query.filter_by(userId=id).all()
        user_programs = {
            pm.jenisBantuanId: {
                'status': pm.status,
                'keterangan': pm.keterangan,
                'dokumen': pm.dokumen,
                'penerimaManfaatId': pm.id  # Menggunakan kolom 'id' dari tabel PenerimaManfaat
            }
            for pm in penerima_manfaat
        }

        programs_data = []
        for program in programs:
            user_program = user_programs.get(program.id, {})
            status = user_program.get('status', 'Belum Didaftari')
            keterangan = user_program.get('keterangan', '')
            dokumen = user_program.get('dokumen', '')
            penerimaManfaatId = user_program.get('penerimaManfaatId', None)
            programs_data.append({
                'id': program.id,
                'namaBantuan': program.nama_bantuan,
                'anggaranPerPaket': program.anggaran_per_paket,
                'deskripsi': program.deskripsi,
                'status': status,
                'keterangan': keterangan,
                'dokumen': dokumen,
                'penerimaManfaatId': penerimaManfaatId  # Menyertakan 'penerimaManfaatId' dalam hasil
            })

        return jsonify(programs_data)

    @staticmethod
    def get_profile(id):
        try:
            user = db.session.query(User).outerjoin(Profile).filter(User.id == id).options(joinedload(User.profile)).first()

            if user is None:
                return jsonify({'message': 'Profile tidak ditemukan'})

            profile = user.profile[0] if user.profile else None

            return jsonify({
                'nik': user.nik,
                'nama': user.nama,
                'email': user.email,
                'foto': profile.foto if profile else '',
                'tempat_lahir': profile.tempat_lahir if profile else '',
                'tanggal_lahir': profile.tanggal_lahir if profile else '',
                'telepon': profile.telepon if profile else '',
                'provinsi': profile.provinsi if profile else '',
                'pekerjaan': profile.pekerjaan if profile else '',
                'penghasilan': profile.penghasilan if profile else '',
                'rekening': profile.rekening if profile else '',
                'alamat': profile.alamat if profile else '',
            })
        except Exception as e:
            return jsonify({
                'message': f'Error: {str(e)}'
            }), 500

    @staticmethod
    def post_profile(id):
        data = request.json

        try:
            profile = Profile.query.filter_by(userId=id).first()

            if profile:
                profile.foto = data['foto']
                profile.tempat_lahir = data['tempat_lahir']
                profile.tanggal_lahir = data['tanggal_lahir']
                profile.telepon = data['telepon']
                profile.provinsi = data['provinsi']
                profile.pekerjaan = data['pekerjaan']
                profile.penghasilan = data['penghasilan']
                profile.rekening = data['rekening']
                profile.alamat = data['alamat']
            else:
                profile = Profile(
                    userId=id,
                    foto=data['foto'],
                    tempat_lahir=data['tempat_lahir'],
                    tanggal_lahir=data['tanggal_lahir'],
                    telepon=data['telepon'],
                    provinsi=data['provinsi'],
                    pekerjaan=data['pekerjaan'],
                    penghasilan=data['penghasilan'],
                    rekening=data['rekening'],
                    alamat=data['alamat'],
                )
                db.session.add(profile)

            db.session.commit()

            return jsonify({
                'message': 'Profile berhasil ditambahkan atau diperbarui'
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'message': f'Error: {str(e)}'
            }), 500
        
    @staticmethod
    def post_penerima_manfaat(id):
        data = request.json
        penerima_manfaat = PenerimaManfaat(
            userId=id,
            jenisBantuanId=data['jenisBantuanId'],
            dokumen=data['dokumen'],
            status='belum diverifikasi',
            keterangan='',
        )

        db.session.add(penerima_manfaat)
        db.session.commit()

        return jsonify({
            'message': 'Penerima manfaat berhasil ditambahkan'
        })
    
    # Update data pendaftaran penerima manfaat sebelum diverifikasi admin
    @staticmethod
    def update_penerima_manfaat(id):
        data = request.json

        penerima_manfaat = PenerimaManfaat.query.filter_by(id=id).first()

        penerima_manfaat.dokumen = data['dokumen']
        db.session.commit()

        return jsonify({
            'message': 'Data penerima manfaat berhasil diubah'
        })

    # Delete data pendaftaran penerima manfaat sebelum diverifikasi admin
    @staticmethod
    def delete_penerima_manfaat(id):
        penerima_manfaat = PenerimaManfaat.query.filter_by(id=id).first()

        db.session.delete(penerima_manfaat)
        db.session.commit()
        return jsonify({
            'message': 'Data penerima manfaat berhasil dihapus'
        })
    
    @staticmethod
    def get_data_jadwal_penyaluran(id):
        result = db.session.query(
         JadwalPenyaluran, PenerimaManfaat, JenisBantuan
        ).join(PenerimaManfaat, JadwalPenyaluran.penerimaManfaatId == PenerimaManfaat.id) \
        .join(JenisBantuan, PenerimaManfaat.jenisBantuanId == JenisBantuan.id) \
        .filter(PenerimaManfaat.userId == id) \
        .all()

        data =  [
            {
            "penyaluranId": jadwal_penyaluran.id,
            "nama_bantuan": jenis_bantuan.nama_bantuan,
            "jadwal_penyaluran": jadwal_penyaluran.jadwal_penyaluran,
            "status": jadwal_penyaluran.status,
            "anggaran_per_paket": jenis_bantuan.anggaran_per_paket
            }
           for jadwal_penyaluran, penerima_manfaat, jenis_bantuan in result
        ]

        return jsonify(data)
    

    @staticmethod
    def update_status_jadwal_penyaluran(id):
        data = request.json

        jadwal_penyaluran = JadwalPenyaluran.query.filter_by(id=id).first()

        jadwal_penyaluran.status = data['status']

        db.session.commit()

        return jsonify({
            'message': 'Status jadwal penyaluran berhasil diubah'
        })
    

    @staticmethod
    def ajukan_ulang_penerima_manfaat(id):
        data = request.json

        penerima_manfaat = PenerimaManfaat.query.filter_by(id=id).first()

        penerima_manfaat.dokumen = data['dokumen']
        penerima_manfaat.status = 'belum diverifikasi'

        db.session.commit()

        return jsonify({
            'message': 'Data penerima manfaat berhasil diajukan ulang'
        })