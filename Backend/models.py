import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

# Database setup - Fix PostgreSQL URL
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')
print(f"🔗 Database URL: {DATABASE_URL}")

# Convert postgresql:// to postgresql+psycopg2:// for SQLAlchemy
if DATABASE_URL.startswith('postgresql://'):
    DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg2://')
    print("✅ Converted PostgreSQL URL for SQLAlchemy")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    try:
        print("🔄 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Test the connection
        with engine.connect() as conn:
            print("✅ Database connection successful!")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise e