from datetime import datetime, timedelta
from clist_api import fetch_contests
from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
import os

app = Flask(__name__)

# ✅ Updated CORS - Replace with your actual Render URLs
CORS(app, origins=[
    "https://your-frontend-name.onrender.com",  # Replace with your actual frontend URL
    "http://localhost:5173",  # For local development
    "http://localhost:3000",  # Alternative local port
])

# Initialize database
init_db()

# JWT setup
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "your-secret-key-123")
jwt = JWTManager(app)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix="/api")

# -------------------------
# ✅ API ROUTES
# -------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

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

@app.route("/api/download-db", methods=["GET"])
def download_db():
    try:
        return send_file("app.db", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# ✅ Error Handlers
# -------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "API endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# -------------------------
# ✅ Production Configuration
# -------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)