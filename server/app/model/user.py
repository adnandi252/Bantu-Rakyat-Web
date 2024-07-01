from datetime import datetime
from app import db

class User(db.Model):
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    nik = db.Column(db.String(16), index=True, unique=True, nullable=False)
    nama = db.Column(db.String(250), nullable=False)
    email = db.Column(db.String(100), index=True, unique=True, nullable=False)
    role = db.Column(db.Enum('admin', 'user'), default='user', nullable=False)
    password = db.Column(db.String(250), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    penerima_manfaat = db.relationship('PenerimaManfaat', backref='user', lazy=True, cascade='all, delete')
    profile = db.relationship('Profile', backref='user', lazy=True, cascade='all, delete')
    def __repr__(self):
        return f'<User {self.nama}>'
