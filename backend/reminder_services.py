# reminder_service.py
from flask_mail import Mail, Message
from flask import current_app
from database import db
from models_database.reminder import ReminderPreference
from models_database.notification import Notification
from datetime import datetime, timedelta


def should_send(pref):
    if not pref.is_active:
        return False
    if pref.last_sent is None:
        return True
    now = datetime.utcnow()
    if pref.frequency == 'monthly':
        return now >= pref.last_sent + timedelta(days=30)
    elif pref.frequency == 'quarterly':
        return now >= pref.last_sent + timedelta(days=90)
    return False


def send_reminder_email(user):
    try:
        mail = Mail(current_app._get_current_object())
        msg = Message(
            subject='ThyroidCare — Time for your thyroid test! 🦋',
            recipients=[user.email],
            body=(
                f"Hi {user.name},\n\n"
                f"This is a friendly reminder to get your thyroid levels checked.\n\n"
                f"Regular monitoring helps detect changes early and keeps you on top of your health.\n\n"
                f"Log in to ThyroidCare to record your latest results:\n"
                f"http://localhost:5173/analyze\n\n"
                f"Stay healthy!\n"
                f"— ThyroidCare Team\n\n"
                f"To change your reminder frequency or turn off reminders, "
                f"visit your Settings page."
            )
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f'Reminder email error for {user.email}: {e}')
        return False


def run_reminders(app):
    with app.app_context():
        prefs = ReminderPreference.query.filter_by(is_active=True).all()
        print(f'[Scheduler] Checking {len(prefs)} reminder preferences...')
        for pref in prefs:
            if should_send(pref):
                success = send_reminder_email(pref.user)
                if success:
                    pref.last_sent = datetime.utcnow()

                    # ── Notification ──────────────────────────
                    notif = Notification(
                        user_id=pref.user_id,
                        title='🔔 Test Reminder Sent',
                        message=f'A reminder email has been sent to {pref.user.email}. Time to check your thyroid levels!',
                        type='reminder'
                    )
                    db.session.add(notif)
                    db.session.commit()
                    print(f'[Scheduler] Reminder sent to {pref.user.email}')