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
app.config["JWT_SECRET_KEY"] = "your-secret-key-123"
jwt = JWTManager(app)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix="/api")

# Test endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200

from clist_api import fetch_contests  # ✅ make sure this import exists

@app.route("/api/contests", methods=["GET"])
def get_contests():  # ✅ renamed to avoid collision
    try:
        contests = fetch_contests()  # ✅ now correctly calls imported function
        
        if not contests:
            return jsonify({
                "message": "No contests found or error fetching data",
                "contests": []
            }), 200
            
        return jsonify(contests), 200
        
    except Exception as e:
        print(f"❌ Error in get_contests endpoint: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": "Failed to fetch contests"
        }), 500


from flask import send_file

@app.route('/download-db', methods=['GET'])
def download_db():
    try:
        return send_file('app.db', as_attachment=True)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # required by Render
    app.run(host="0.0.0.0", port=port)