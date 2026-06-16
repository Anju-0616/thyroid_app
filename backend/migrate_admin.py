# migrate_admin.py
# Run this ONCE to add is_admin column to existing database:
#   python migrate_admin.py
#
# To make a user admin, also run:
#   python migrate_admin.py --promote your@email.com

import sys
import os
from dotenv import load_dotenv

load_dotenv()

from app import app
from database import db
from sqlalchemy import text

with app.app_context():
    # Add is_admin column if it doesn't exist
    try:
        db.session.execute(text(
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL"
        ))
        db.session.commit()
        print("✅ is_admin column added (or already exists).")
    except Exception as e:
        db.session.rollback()
        print(f"Column migration error (may already exist): {e}")

    # Promote a user to admin if --promote flag is given
    if '--promote' in sys.argv:
        idx = sys.argv.index('--promote')
        if idx + 1 < len(sys.argv):
            email = sys.argv[idx + 1].strip().lower()
            from models_database.user import User
            user = User.query.filter_by(email=email).first()
            if not user:
                print(f"❌ No user found with email: {email}")
            else:
                user.is_admin = True
                db.session.commit()
                print(f"✅ {user.name} ({email}) is now an admin.")
        else:
            print("❌ Please provide an email: python migrate_admin.py --promote admin@example.com")