from datetime import datetime, timedelta
from clist_api import fetch_contests
from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
import os

# Try to serve static frontend only if it exists
frontend_build_path = os.path.abspath("../Frontend/dist")
serve_frontend = os.path.exists(frontend_build_path)

app = Flask(
    __name__,
    static_folder=frontend_build_path if serve_frontend else None,
    static_url_path="" if serve_frontend else None
)
CORS(app)

# Initialize database
init_db()

# JWT setup
app.config["JWT_SECRET_KEY"] = "your-secret-key-123"
jwt = JWTManager(app)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix="/api")

# -------------------------
# ✅ API ROUTES
# -------------------------

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
# ✅ SPA Routing (Only if frontend exists)
# -------------------------

if serve_frontend:
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        if path.startswith("api/"):
            return jsonify({"error": "API endpoint not found"}), 404

        # If exact file exists in dist, serve it
        requested_path = os.path.join(app.static_folder, path)
        if os.path.exists(requested_path):
            return send_from_directory(app.static_folder, path)

        # Fallback to index.html
        index_file = os.path.join(app.static_folder, "index.html")
        if os.path.exists(index_file):
            return send_from_directory(app.static_folder, "index.html")
        else:
            return jsonify({"error": "index.html not found"}), 500

else:
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def fallback_api(path):
        return jsonify({"error": "Frontend not available"}), 501

# -------------------------
# ✅ Start app
# -------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
