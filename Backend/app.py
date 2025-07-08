from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import init_db
from auth import auth_bp
import os

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = "your-secret-key-123"
jwt = JWTManager(app)

init_db()

app.register_blueprint(auth_bp, url_prefix="/api")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))