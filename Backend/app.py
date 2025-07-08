from datetime import datetime, timedelta
from clist_api import fetch_contests
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
import os

app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# JWT setup
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "your-secret-key-123")
jwt = JWTManager(app)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix="/api")

@app.route("/")
def root():
    return jsonify({"message": "Contest Tracker API", "status": "running"}), 200

@app.route("/api/home", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200

@app.route("/api/contests", methods=["GET"])
def get_contests():
    try:
        contests = fetch_contests()
        return jsonify(contests if contests else {
            "message": "No contests found or error fetching data",
            "contests": []
        }), 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": "Failed to fetch contests"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_ENV") != "production"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)