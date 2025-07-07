from datetime import datetime, timedelta
from clist_api import fetch_contests
from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from models import init_db
import os

# Configure Flask to serve React build files
app = Flask(__name__, 
            static_folder='../Frontend/dist',  # Points to your dist folder
            static_url_path='')
CORS(app)

# Initialize database
init_db()

# JWT setup
app.config["JWT_SECRET_KEY"] = "your-secret-key-123"
jwt = JWTManager(app)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix="/api")

# API Routes
@app.route("/api/home", methods=["GET"])
def home():
    return jsonify({"message": "Auth API running"}), 200

@app.route("/api/contests", methods=["GET"])
def get_contests():
    try:
        contests = fetch_contests()
        
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

@app.route('/api/download-db', methods=['GET'])
def download_db():
    try:
        return send_file('app.db', as_attachment=True)
    except Exception as e:
        return {"error": str(e)}

# SPA Routing - This catches all non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(f"🔍 Serving path: '{path}'")  # Debug log
    print(f"📁 Static folder: {app.static_folder}")  # Debug log
    
    # If it's an API route, return 404
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Check if static folder exists
    if not os.path.exists(app.static_folder):
        print(f"❌ Static folder doesn't exist: {app.static_folder}")
        return jsonify({"error": "Static folder not found"}), 500
    
    # If file exists in dist folder, serve it
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        print(f"📄 Serving file: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        # For all other routes, serve React's index.html
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            print(f"🏠 Serving index.html for path: {path}")
            return send_from_directory(app.static_folder, 'index.html')
        else:
            print(f"❌ index.html not found at: {index_path}")
            return jsonify({"error": "index.html not found"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)  # Added debug=True