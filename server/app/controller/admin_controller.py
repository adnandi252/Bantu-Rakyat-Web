from flask import jsonify, request
from app.model.penerima_manfaat import PenerimaManfaat
from app.model.jenis_bantuan import JenisBantuan
from app.model.jadwal_penyaluran import JadwalPenyaluran
from app.model.user import User
from app.model.profile import Profile
from app import db
from sqlalchemy.sql import func
from sqlalchemy.orm import aliased

class AdminController:
    @staticmethod
    def get_dashboard_data():
        # Informasi Pendaftar Bantuan Sosial
        status_to_filter = ['aktif', 'nonaktif']
        diterima = PenerimaManfaat.query.filter(PenerimaManfaat.status.in_(status_to_filter)).count()
        ditolak = PenerimaManfaat.query.filter_by(status='ditolak').count()
        belum_diverifikasi = PenerimaManfaat.query.filter_by(status='belum diverifikasi').count()

        # Informasi Bantuan Tersalurkan
        bantuan_tersalurkan = JadwalPenyaluran.query.count()

        # Informasi Jenis Bantuan
        result = db.session.query(
            JenisBantuan.nama_bantuan.label('nama'),
            func.count(PenerimaManfaat.jenisBantuanId).label('jumlah')
        ).outerjoin(
            PenerimaManfaat, PenerimaManfaat.jenisBantuanId == JenisBantuan.id
        ).group_by(
            JenisBantuan.id
        ).all()
        data_jenis_bantuan = [{'nama': row.nama, 'jumlah_penerima': row.jumlah} for row in result]

        data = {
            'pendaftar_bantuan_sosial': {
                'diterima': diterima,
                'ditolak': ditolak,
                'belum_diverifikasi': belum_diverifikasi
            },
            'bantuan_tersalurkan': {
                'total': bantuan_tersalurkan,
            },
            'jenis_bantuan': data_jenis_bantuan
        }

        return jsonify(data)


    @staticmethod
    def get_data_program_bantuan():
        JenisBantuanAlias = aliased(JenisBantuan)
        PenerimaManfaatAlias = aliased(PenerimaManfaat)
        JadwalPenyaluranAlias = aliased(JadwalPenyaluran)

        query = db.session.query(
            JenisBantuanAlias.id.label('id'),
            JenisBantuanAlias.nama_bantuan.label('nama'),
            JenisBantuanAlias.anggaran_per_paket,
            JenisBantuanAlias.status,
            JenisBantuanAlias.deskripsi,
            func.count(func.distinct(PenerimaManfaatAlias.id)).label('jumlah_pendaftar'),
            func.count(JadwalPenyaluranAlias.id).label('jumlah_paket_tersalurkan')
        ).outerjoin(
            PenerimaManfaatAlias,
            PenerimaManfaatAlias.jenisBantuanId == JenisBantuanAlias.id
        ).outerjoin(
            JadwalPenyaluranAlias,
            JadwalPenyaluranAlias.penerimaManfaatId == PenerimaManfaatAlias.id
        ).group_by(
            JenisBantuanAlias.id
        )

        result = query.all()

        data = [{
            'id': row.id,
            'nama_bantuan': row.nama,
            'anggaran_per_paket': row.anggaran_per_paket,
            'status': row.status,
            'jumlah_pendaftar': row.jumlah_pendaftar,
            'jumlah_paket_tersalurkan': row.jumlah_paket_tersalurkan,
            'deskripsi': row.deskripsi
        } for row in result]

        response = jsonify(data)
        return response
    
    @staticmethod
    def get_data_verifikasi_penerima_manfaat():
        query = db.session.query(
            User, PenerimaManfaat, Profile, JenisBantuan
        ).join(
            PenerimaManfaat, User.id == PenerimaManfaat.userId
        ).outerjoin(
            Profile, User.id == Profile.userId
        ).join(
            JenisBantuan, PenerimaManfaat.jenisBantuanId == JenisBantuan.id
        ).filter(
            PenerimaManfaat.status.in_(['belum diverifikasi', 'ditolak'])
        )

        result = query.all()

        data = [
            {
                'id': penerima_manfaat.id,
                'userId': user.id,
                'nik': user.nik,
                'email': user.email,
                'nama_bantuan': jenis_bantuan.nama_bantuan,
                'nama_user': user.nama,
                'created_at': penerima_manfaat.created_at,
                'status': penerima_manfaat.status,
                'tempat_lahir': profile.tempat_lahir if profile else None,
                'foto': profile.foto if profile else None,
                'tanggal_lahir': profile.tanggal_lahir if profile else None,
                'dokumen': penerima_manfaat.dokumen,
                'telepon': profile.telepon if profile else None,
                'provinsi': profile.provinsi if profile else None,
                'pekerjaan': profile.pekerjaan if profile else None,
                'penghasilan': profile.penghasilan if profile else None,
                'rekening': profile.rekening if profile else None,
                'alamat': profile.alamat if profile else None,
                'keterangan': penerima_manfaat.keterangan if penerima_manfaat.keterangan else '',
            }
            for user, penerima_manfaat, profile, jenis_bantuan in result
        ]

        response = jsonify(data)

        return response
    
    @staticmethod
    def get_data_penerima_manfaat():
        query = db.session.query(
            User, PenerimaManfaat, Profile,JenisBantuan
        ).join(
            PenerimaManfaat, User.id == PenerimaManfaat.userId
        ).outerjoin(
            Profile, User.id == Profile.userId
        ).join(
            JenisBantuan, PenerimaManfaat.jenisBantuanId == JenisBantuan.id
        ).filter(
            PenerimaManfaat.status.in_(['aktif', 'nonaktif'])
        )

        result = query.all()

        data = [
            {
                'id': penerima_manfaat.id,
                'userId': user.id,
                'nik': user.nik,
                'email': user.email,
                'penerimaManfaatId': penerima_manfaat.id,
                'nama_bantuan': jenis_bantuan.nama_bantuan,
                'nama_user': user.nama,
                'created_at': penerima_manfaat.created_at,
                'status': penerima_manfaat.status,
                'tempat_lahir': profile.tempat_lahir if profile else None,
                'foto': profile.foto if profile else None,
                'tanggal_lahir': profile.tanggal_lahir if profile else None,
                'dokumen': penerima_manfaat.dokumen,
                'telepon': profile.telepon if profile else None,
                'provinsi': profile.provinsi if profile else None,
                'pekerjaan': profile.pekerjaan if profile else None,
                'penghasilan': profile.penghasilan if profile else None,
                'rekening': profile.rekening if profile else None,
                'alamat': profile.alamat if profile else None,
                'keterangan': penerima_manfaat.keterangan if penerima_manfaat.keterangan else '',
            }
            for user, penerima_manfaat, profile, jenis_bantuan in result
        ]

        response = jsonify(data)

        return response
    
    @staticmethod
    def get_data_penyaluran_bantuan():
        query = db.session.query(
            User, PenerimaManfaat, JenisBantuan, JadwalPenyaluran
        ).join(
            PenerimaManfaat, User.id == PenerimaManfaat.userId
        ).join(
            JenisBantuan, PenerimaManfaat.jenisBantuanId == JenisBantuan.id
        ).join(
            JadwalPenyaluran, PenerimaManfaat.id == JadwalPenyaluran.penerimaManfaatId
        )

        result = query.all()

        data = [
            {
                'userId': user.id,
                'jadwalPenyaluranId': jadwal_penyaluran.id,
                'nik': user.nik,
                'nama_user': user.nama,
                'nama_bantuan': jenis_bantuan.nama_bantuan,
                'jadwal_penyaluran': jadwal_penyaluran.jadwal_penyaluran,
                'status': jadwal_penyaluran.status
            }
            for user, _, jenis_bantuan, jadwal_penyaluran in result
        ]

        response = jsonify(data)
        return response
    



### CREATE
    @staticmethod
    def create_jenis_bantuan():
        data = request.get_json()

        if 'nama_bantuan' not in data or 'anggaran_per_paket' not in data or 'deskripsi' not in data:
            response = jsonify({'error': 'Data JSON tidak lengkap'})
            response.status_code = 400
            return response

        jenis_bantuan = JenisBantuan(
            nama_bantuan=data['nama_bantuan'],
            anggaran_per_paket=data['anggaran_per_paket'],
            deskripsi=data['deskripsi'],
            status=data['status']
        )

        db.session.add(jenis_bantuan)
        db.session.commit()

        response = jsonify({'message': 'Jenis bantuan berhasil ditambahkan'})

        return response
    
    @staticmethod
    def create_penyaluran_bantuan():
        data = request.get_json()

        if 'penerimaManfaatId' not in data or 'jadwal_penyaluran' not in data:
            response = jsonify({'error': 'Data JSON tidak lengkap'})
            response.status_code = 400
            return response

        penyaluran_bantuan = JadwalPenyaluran(
            penerimaManfaatId=data['penerimaManfaatId'],
            jadwal_penyaluran=data['jadwal_penyaluran'],
            status=data['status']
        )

        db.session.add(penyaluran_bantuan)
        db.session.commit()

        response = jsonify({'message': 'Penyaluran bantuan berhasil ditambahkan'})

        return response
    



### UPDATE
    @staticmethod
    def update_jenis_bantuan(id):
        data = request.get_json()

        if 'nama_bantuan' not in data or 'anggaran_per_paket' not in data or 'deskripsi' not in data:
            response = jsonify({'error': 'Data JSON tidak lengkap'})
            response.status_code = 400
            return response
        
        jenis_bantuan = JenisBantuan.query.filter_by(id=id).first()
        
        if jenis_bantuan is None:
            response = jsonify({'error': 'Jenis bantuan tidak ditemukan'})
            response.status_code = 404
            return response
        
        jenis_bantuan.nama_bantuan = data['nama_bantuan']
        jenis_bantuan.anggaran_per_paket = data['anggaran_per_paket']
        jenis_bantuan.deskripsi = data['deskripsi']
        jenis_bantuan.status = data['status']

        db.session.commit()

        response = jsonify({'message': 'Jenis bantuan berhasil diupdate'})
        return response

    @staticmethod
    def update_status_penerima_manfaat(id):
        data = request.get_json()

        penerima_manfaat = PenerimaManfaat.query.filter_by(id=id).first()

        if penerima_manfaat is None:
            response = jsonify({'error': 'Penerima manfaat tidak ditemukan'})
            response.status_code = 404
            return response
        
        if 'status' not in data:
            response = jsonify({'error': 'Data JSON tidak lengkap'})
            response.status_code = 400
            return response
        
        penerima_manfaat.status = data['status']
        penerima_manfaat.keterangan = data['keterangan']

        db.session.commit()

        response = jsonify({'message': 'Status penerima manfaat berhasil diupdate'})
        return response


    @staticmethod
    def update_penyaluran_bantuan(id):
        data = request.get_json()

        penyaluran_bantuan = JadwalPenyaluran.query.filter_by(id=id).first()

        if penyaluran_bantuan is None:
            response = jsonify({'error': 'Penyaluran bantuan tidak ditemukan'})
            response.status_code = 404
            return response
        
        if 'jadwal_penyaluran' not in data:
            response = jsonify({'error': 'Data JSON tidak lengkap'})
            response.status_code = 400
            return response
        
        penyaluran_bantuan.jadwal_penyaluran = data['jadwal_penyaluran']

        db.session.commit()

        response = jsonify({'message': 'Jadwal penyaluran bantuan berhasil diupdate'})

        return response