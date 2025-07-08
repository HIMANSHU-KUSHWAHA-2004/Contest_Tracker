from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

# Flask-SQLAlchemy instance (for db.create_all and Flask support)
db = SQLAlchemy()

# SQLAlchemy core setup (for SessionLocal)
Base = declarative_base()
DATABASE_URL = os.getenv("DATABASE_URL")

# Engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ User model (inherits from Base, not db.Model)
class User(Base):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# ✅ DB initializer for Flask
def init_db(app):
    db.init_app(app)
    with app.app_context():
        Base.metadata.create_all(bind=engine)  # Use Base not db
