from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
import os

app = Flask(__name__)
CORS(app)

# 🛢️ Database config
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "your-secret-key-123")

# ✅ Initialize the database
try:
    init_db()
    print("✅ Database initialized")
except Exception as e:
    print(f"❌ Database error: {e}")

# ✅ JWT setup
jwt = JWTManager(app)

# ✅ Register your authentication routes
app.register_blueprint(auth_bp, url_prefix="/api")

@app.route("/")
def root():
    return jsonify({"message": "API running"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
