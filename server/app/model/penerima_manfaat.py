from datetime import datetime
from app import db

class PenerimaManfaat(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    userId = db.Column(db.BigInteger, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    jenisBantuanId = db.Column(db.BigInteger, db.ForeignKey('jenis_bantuan.id', ondelete='CASCADE'), nullable=False)
    tempat_lahir = db.Column(db.String(250), nullable=False)
    tanggal_lahir = db.Column(db.Date, nullable=False)
    alamat = db.Column(db.Text, nullable=False)
    telepon = db.Column(db.String(15), nullable=False)
    provinsi = db.Column(db.String(250), nullable=False)
    pekerjaan = db.Column(db.String(250), nullable=False)
    penghasilan = db.Column(db.Float, nullable=False)
    rekening = db.Column(db.String(50), nullable=False)
    dokumen = db.Column(db.String(250), nullable=False)
    status = db.Column(db.Enum('aktif', 'nonaktif', 'ditolak', 'belum diverifikasi'), nullable=False, default='belum diverifikasi')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jadwal_penyaluran = db.relationship('JadwalPenyaluran', backref='penerima_manfaat', lazy=True, cascade='all, delete')

    def __repr__(self):
        return f'<PenerimaManfaat {self.userId}>'
