from flask import Blueprint, request, jsonify
from models import SessionLocal, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    db = SessionLocal()
    try:
        data = request.get_json()
        name = data.get("name")
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validate all fields
        if not name or not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Check if user exists by email or username
        if db.query(User).filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 409
            
        if db.query(User).filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 409

        # Hash password and create user
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(
            name=name,
            username=username,
            email=email, 
            password=hashed_pw.decode('utf-8')
        )
        
        db.add(new_user)
        db.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": "Registration failed"}), 500
    finally:
        db.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    db = SessionLocal()
    try:
        data = request.get_json()
        print("📨 Login payload:", data)

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            print("❌ Missing email or password")
            return jsonify({"error": "Email and password required"}), 400

        user = db.query(User).filter_by(email=email).first()
        if not user:
            print("❌ No user found with that email")
            return jsonify({"error": "Invalid credentials"}), 401

        print("🔐 Checking password...")
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            print("❌ Password mismatch")
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=str(user.id))
        print("✅ Login success!")

        return jsonify({
            "token": access_token,
            "user": {
                "name": user.name,
                "username": user.username,
                "email": user.email
            }
        }), 200
        
    except Exception as e:
        print("🔥 Login error:", str(e))
        return jsonify({"error": "Login failed"}), 500
    finally:
        db.close()
