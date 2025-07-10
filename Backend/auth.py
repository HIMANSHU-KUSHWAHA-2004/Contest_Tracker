from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import SessionLocal, User
import bcrypt

auth_bp = Blueprint('auth', __name__)


# Register new user
@auth_bp.route("/register", methods=["POST"])
def register():
    db = SessionLocal()

    try:
        data = request.get_json()
        name = data.get("name")
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validate required fields
        if not name or not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Check for existing email
        if db.query(User).filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 409

        # Check for existing username
        if db.query(User).filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 409

        # Hash the password
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create new user
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


# Login user
@auth_bp.route("/login", methods=["POST"])
def login():
    db = SessionLocal()

    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Validate required fields
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        # Find user by email
        user = db.query(User).filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "token": access_token,
            "user": {
                "name": user.name,
                "username": user.username,
                "email": user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Login failed"}), 500

    finally:
        db.close()
