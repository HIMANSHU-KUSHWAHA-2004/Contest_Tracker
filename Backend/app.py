# Backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, init_db
from auth import auth_bp
from clist_api import fetch_contests
import os

app = Flask(__name__)
CORS(app)

# ✅ PostgreSQL only — no SQLite fallback
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ✅ Initialize database
init_db(app)

# ✅ JWT setup
app.config["JWT_SECRET_KEY"] = "your-secret-key-123"
jwt = JWTManager(app)

# ✅ Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api")

# ✅ Routes
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200

@app.route("/api/contests", methods=["GET"])
def get_contests():
    try:
        contests = fetch_contests()
        return jsonify(contests or {"message": "No contests found"}), 200
    except Exception as e:
        print("❌ Error fetching contests:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
