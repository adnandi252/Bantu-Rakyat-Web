from datetime import datetime
from app import db

class JadwalPenyaluran(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    penerimaManfaatId = db.Column(db.BigInteger, db.ForeignKey('penerima_manfaat.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.Enum('proses', 'selesai'), nullable=False, default='proses')
    jadwal_penyaluran = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<JadwalPenyaluran {self.id}>'
