# app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from flasgger import Swagger
from flask_mail import Mail
from database import db, init_db
from routes.auth_routes import auth_bp
from routes.prediction_routes import prediction_bp
from routes.records_routes import records_bp
from routes.doctor_routes import doctor_bp
from routes.appointment_routes import appointment_bp
from routes.reminder_routes import reminder_bp
from routes.report_routes import report_bp
from routes.notification_routes import notification_bp
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = Flask(__name__)
app.config.from_object(Config)

mail = Mail(app)
Swagger(app)

CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

init_db(app)

app.register_blueprint(auth_bp,          url_prefix='/api/auth')
app.register_blueprint(prediction_bp,    url_prefix='/api')
app.register_blueprint(records_bp,       url_prefix='/api')
app.register_blueprint(doctor_bp,        url_prefix='/api')
app.register_blueprint(appointment_bp,   url_prefix='/api')
app.register_blueprint(reminder_bp,      url_prefix='/api')
app.register_blueprint(report_bp,        url_prefix='/api')
app.register_blueprint(notification_bp,  url_prefix='/api')

from reminder_services import run_reminders

scheduler = BackgroundScheduler()
scheduler.add_job(
    func=lambda: run_reminders(app),
    trigger='interval',
    hours=12,
    id='reminder_job'
)
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

@app.route('/')
def home():
    return {'message': 'Thyroid Detection API is running!'}

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)