# routes/report_routes.py
from flask import Blueprint, send_file, jsonify, request, after_this_request
from database import db
from models_database.thyroid_record import ThyroidRecord
from models_database.user import User
from fpdf import FPDF
import jwt, os, io
from datetime import datetime

report_bp = Blueprint('report', __name__)


def get_user_id_from_token(req):
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        decoded = jwt.decode(
            token,
            os.getenv('JWT_SECRET_KEY', 'thyroid_app_secret_key'),
            algorithms=['HS256']
        )
        return decoded.get('user_id')
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def get_recommendation(avg_tsh, latest_result):
    if latest_result == 'hypothyroid':
        return (
            'Your recent results suggest hypothyroidism (underactive thyroid). '
            'Common symptoms include fatigue, weight gain, and cold sensitivity. '
            'Please consult an endocrinologist for proper diagnosis and treatment.'
        )
    elif latest_result == 'hyperthyroid':
        return (
            'Your recent results suggest hyperthyroidism (overactive thyroid). '
            'Common symptoms include weight loss, rapid heartbeat, and anxiety. '
            'Please consult an endocrinologist as soon as possible.'
        )
    else:
        return (
            'Your thyroid hormone levels appear to be within the normal range. '
            'Continue with regular monitoring as advised by your doctor. '
            'Maintain a healthy lifestyle and diet to support thyroid health.'
        )


@report_bp.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    return response


@report_bp.route('/report/download', methods=['GET', 'OPTIONS'])
def download_report():
    """
    Download PDF report of all thyroid test results
    ---
    tags:
      - Report
    responses:
      200:
        description: PDF file download
      401:
        description: Unauthorized
      404:
        description: No records found
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    user = User.query.get(user_id)
    records = ThyroidRecord.query.filter_by(user_id=user_id)\
        .order_by(ThyroidRecord.created_at.desc()).all()

    if not records:
        return jsonify({'message': 'No records found to generate report'}), 404

    # ── Stats ──────────────────────────────────────────────
    total        = len(records)
    normal_count = sum(1 for r in records if r.result == 'normal')
    abnormal_count = total - normal_count
    avg_tsh = sum(r.tsh for r in records) / total
    avg_t3  = sum(r.t3  for r in records) / total
    avg_tt4 = sum(r.tt4 for r in records) / total

    streak = 0
    for r in records:
        if r.result == 'normal':
            streak += 1
        else:
            break

    latest_result  = records[0].result
    recommendation = get_recommendation(avg_tsh, latest_result)

    # ── Build PDF ──────────────────────────────────────────
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Header
    pdf.set_fill_color(37, 99, 235)
    pdf.rect(0, 0, 210, 30, 'F')
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('Helvetica', 'B', 20)
    pdf.set_xy(10, 8)
    pdf.cell(0, 12, 'ThyroidCare - Health Report', ln=True)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_xy(10, 20)
    pdf.cell(0, 6, f'Generated on {datetime.utcnow().strftime("%d %b %Y, %H:%M")} UTC', ln=True)
    pdf.ln(15)

    # Patient info
    pdf.set_text_color(30, 30, 30)
    pdf.set_font('Helvetica', 'B', 13)
    pdf.cell(0, 8, 'Patient Information', ln=True)
    pdf.set_draw_color(37, 99, 235)
    pdf.set_line_width(0.5)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 7, f'Name  : {user.name}', ln=True)
    pdf.cell(0, 7, f'Email : {user.email}', ln=True)
    pdf.ln(5)

    # Summary stats
    pdf.set_font('Helvetica', 'B', 13)
    pdf.cell(0, 8, 'Summary Statistics', ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

    stats = [
        ('Total Tests',      str(total)),
        ('Normal Results',   str(normal_count)),
        ('Abnormal Results', str(abnormal_count)),
        ('Normal Streak',    f'{streak} test(s) in a row'),
        ('Average TSH',      f'{avg_tsh:.2f} mIU/L'),
        ('Average T3',       f'{avg_t3:.2f} nmol/L'),
        ('Average TT4',      f'{avg_tt4:.2f} nmol/L'),
        ('Latest Result',    latest_result.capitalize()),
    ]

    pdf.set_font('Helvetica', '', 11)
    for label, value in stats:
        pdf.set_font('Helvetica', 'B', 11)
        pdf.cell(60, 7, label, ln=False)
        pdf.set_font('Helvetica', '', 11)
        pdf.cell(0, 7, value, ln=True)
    pdf.ln(5)

    # Recommendation
    pdf.set_font('Helvetica', 'B', 13)
    pdf.cell(0, 8, 'Recommendation', ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_fill_color(239, 246, 255)
    pdf.set_font('Helvetica', '', 11)
    pdf.multi_cell(0, 7, recommendation, fill=True)
    pdf.ln(5)

    # Results table
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, 'Test History', ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

    col_widths = [10, 40, 30, 25, 25, 35, 25]
    headers    = ['#', 'Date', 'TSH', 'T3', 'TT4', 'Result', 'Status']

    pdf.set_fill_color(37, 99, 235)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('Helvetica', 'B', 10)
    for i, h in enumerate(headers):
        pdf.cell(col_widths[i], 8, h, border=0, fill=True)
    pdf.ln()

    pdf.set_text_color(30, 30, 30)
    pdf.set_font('Helvetica', '', 9)
    for idx, r in enumerate(records):
        if idx % 2 == 0:
            pdf.set_fill_color(239, 246, 255)
        else:
            pdf.set_fill_color(255, 255, 255)
        row = [
            str(idx + 1),
            r.created_at.strftime('%d %b %Y'),
            f'{r.tsh:.2f}',
            f'{r.t3:.2f}',
            f'{r.tt4:.2f}',
            r.result.capitalize(),
            'Normal' if r.result == 'normal' else 'Abnormal',
        ]
        for i, cell in enumerate(row):
            pdf.cell(col_widths[i], 7, cell, border=0, fill=True)
        pdf.ln()

    pdf.ln(8)

    # Disclaimer
    pdf.set_font('Helvetica', 'I', 9)
    pdf.set_text_color(120, 120, 120)
    pdf.multi_cell(0, 5,
        'This report is generated by ThyroidCare and is intended for personal '
        'reference only. It does not constitute medical advice. Always consult a '
        'qualified healthcare professional for diagnosis and treatment.'
    )

    # ── Stream PDF ─────────────────────────────────────────
    pdf_bytes = pdf.output()
    buffer = io.BytesIO(bytes(pdf_bytes))
    buffer.seek(0)

    filename = f'thyroidcare_report_{user.name.replace(" ", "_")}_{datetime.utcnow().strftime("%Y%m%d")}.pdf'

    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )