from datetime import datetime
from app import db

class JenisBantuan(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    nama_bantuan = db.Column(db.String(250), nullable=False)
    anggaran_per_paket = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum('aktif', 'nonaktif'), nullable=False, default='aktif')
    deskripsi = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    penerima_manfaat = db.relationship('PenerimaManfaat', backref='jenis_bantuan', lazy=True, cascade='all, delete')

    def __repr__(self):
        return f'<JenisBantuan {self.nama_bantuan}>'


    def to_dict(self):
        return {
            'id': self.id,
            'nama_bantuan': self.nama_bantuan,
            'anggaran_per_paket': self.anggaran_per_paket,
            'status': self.status,
            'deskripsi': self.deskripsi,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }