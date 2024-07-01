from datetime import datetime
from app import db

class PenerimaManfaat(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    userId = db.Column(db.BigInteger, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    jenisBantuanId = db.Column(db.BigInteger, db.ForeignKey('jenis_bantuan.id', ondelete='CASCADE'), nullable=False)
    dokumen = db.Column(db.Text, nullable=False)
    keterangan = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('aktif', 'nonaktif', 'ditolak', 'belum diverifikasi'), nullable=False, default='belum diverifikasi')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jadwal_penyaluran = db.relationship('JadwalPenyaluran', backref='penerima_manfaat', lazy=True, cascade='all, delete')

    def __repr__(self):
        return f'<PenerimaManfaat {self.userId}>'
