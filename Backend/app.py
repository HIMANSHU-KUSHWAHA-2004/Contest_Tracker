from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
from clist_api import fetch_contests
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# App configuration
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://myapp_data_user:"
    "NgwwTcLgrhoGMSNACh4FtsJmoauNVpAV"
    "@dpg-d1mgbaadbo4c73f9g7vg-a.oregon-postgres.render.com/myapp_data"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your-secret-key-123"

# Initialize JWT and Database
jwt = JWTManager(app)
init_db()

# Register authentication blueprint
app.register_blueprint(auth_bp, url_prefix="/api")


# Root route (health check)
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200


# Fetch contests from clist API
@app.route("/api/contests", methods=["GET"])
def get_contests():
    try:
        contests = fetch_contests()

        if not contests:
            return jsonify({
                "message": "No contests found",
                "contests": []
            }), 200

        return jsonify(contests), 200

    except Exception as e:
        print(f"❌ Error fetching contests: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# Run the Flask app
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )
