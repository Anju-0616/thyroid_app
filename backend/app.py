from flask import Flask
from flask_cors import CORS
from config import Config
from database import db, init_db
from routes.auth_routes import auth_bp
from routes.prediction_routes import prediction_bp
from routes.records_routes import records_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

init_db(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(prediction_bp, url_prefix='/api')
app.register_blueprint(records_bp, url_prefix='/api')

@app.route('/')
def home():
    return {'message': 'Thyroid Detection API is running!'}

if __name__ == '__main__':
    app.run(debug=True)