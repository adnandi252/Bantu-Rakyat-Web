from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app.model import user, jenis_bantuan, penerima_manfaat, jadwal_penyaluran, profile
from app import routes