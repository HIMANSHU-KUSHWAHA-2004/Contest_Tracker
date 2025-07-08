# Backend/models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ✅ User model
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# ✅ Initialize DB
def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
