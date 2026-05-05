from app import app
from database import db
from sqlalchemy import text

with app.app_context():
    with db.engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE NOT NULL,
            ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6),
            ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP
        """))
        conn.commit()
    print("Migration done — columns added.")