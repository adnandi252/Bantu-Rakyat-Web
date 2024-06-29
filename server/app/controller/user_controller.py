from flask import jsonify, request
from app.model.penerima_manfaat import PenerimaManfaat
from app.model.jenis_bantuan import JenisBantuan
from app.model.jadwal_penyaluran import JadwalPenyaluran
from app.model.user import User
from app import db
from sqlalchemy.sql import func
from sqlalchemy.orm import aliased


class UserController:
    @staticmethod
    def get_dashboard_data(id):
        total_packages = db.session.query(
        func.count(JadwalPenyaluran.id).label('total')
        ).join(PenerimaManfaat, JadwalPenyaluran.penerimaManfaatId == PenerimaManfaat.id) \
        .join(JenisBantuan, PenerimaManfaat.jenisBantuanId == JenisBantuan.id) \
        .filter(PenerimaManfaat.userId == id) \
        .filter(JadwalPenyaluran.status == 'selesai') \
        .scalar()

        # Query to get the count of each jenis bantuan received by the user
        jenis_bantuan_counts = db.session.query(
            JenisBantuan.nama_bantuan,
            func.count(JadwalPenyaluran.id).label('count')
        ).join(PenerimaManfaat, PenerimaManfaat.jenisBantuanId == JenisBantuan.id) \
        .join(JadwalPenyaluran, JadwalPenyaluran.penerimaManfaatId == PenerimaManfaat.id) \
        .filter(PenerimaManfaat.userId == id) \
        .filter(JadwalPenyaluran.status == 'selesai') \
        .group_by(JenisBantuan.nama_bantuan) \
        .all()

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
        user_programs = {pm.jenisBantuanId: pm.status for pm in penerima_manfaat}

        programs_data = []
        for program in programs:
            status = user_programs.get(program.id, 'Belum Didaftari')
            programs_data.append({
                'id': program.id,
                'namaBantuan': program.nama_bantuan,
                'anggaranPerPaket': program.anggaran_per_paket,
                'deskripsi': program.deskripsi,
                'status': status
            })

        return jsonify(programs_data)

    @staticmethod
    def post_penerima_manfaat(id):
        data = request.json
        penerima_manfaat = PenerimaManfaat(
            userId=id,
            jenisBantuanId=data['jenisBantuanId'],
            tempat_lahir=data['tempat_lahir'],
            tanggal_lahir=data['tanggal_lahir'],
            telepon=data['telepon'],
            provinsi=data['provinsi'],
            pekerjaan=data['pekerjaan'],
            penghasilan=data['penghasilan'],
            rekening=data['rekening'],
            dokumen=data['dokumen'],
            alamat=data['alamat'],
            status='belum diverifikasi'
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

        penerima_manfaat.tempat_lahir = data['tempat_lahir']
        penerima_manfaat.tanggal_lahir = data['tanggal_lahir']
        penerima_manfaat.telepon = data['telepon']
        penerima_manfaat.provinsi = data['provinsi']
        penerima_manfaat.pekerjaan = data['pekerjaan']
        penerima_manfaat.penghasilan = data['penghasilan']
        penerima_manfaat.rekening = data['rekening']
        penerima_manfaat.dokumen = data['dokumen']
        penerima_manfaat.alamat = data['alamat']
        penerima_manfaat.jenisBantuanId = data['jenisBantuanId']

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