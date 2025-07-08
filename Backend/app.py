from datetime import datetime, timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
from clist_api import fetch_contests
import os

app = Flask(__name__)
CORS(app)

# ✅ PostgreSQL config from environment variable
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ✅ Initialize DB
init_db(app)

# ✅ JWT Setup
app.config["JWT_SECRET_KEY"] = "your-secret-key-123"
jwt = JWTManager(app)

# ✅ Register routes
app.register_blueprint(auth_bp, url_prefix="/api")

# ✅ Health Check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200

# ✅ Contests route
@app.route("/api/contests", methods=["GET"])
def get_contests():
    try:
        contests = fetch_contests()
        if not contests:
            return jsonify({"message": "No contests found", "contests": []}), 200
        return jsonify(contests), 200
    except Exception as e:
        print(f"❌ Error in get_contests: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
