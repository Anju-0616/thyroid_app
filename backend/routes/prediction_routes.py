# prediction_routes.py
from flask import Blueprint, request, jsonify

prediction_bp = Blueprint('prediction', __name__)


def classify_thyroid(tsh, t3, tt4):
    """
    Rule-based classifier using standard clinical thresholds:
    TSH  normal: 0.5 – 4.5 mIU/L
    T3   normal: 80  – 200 ng/dL
    TT4  normal: 5.0 – 12.0 µg/dL
    """
    tsh_low  = tsh < 0.5
    tsh_high = tsh > 4.5
    t3_low   = t3  < 80
    t3_high  = t3  > 200
    tt4_low  = tt4 < 5.0
    tt4_high = tt4 > 12.0

    # Hyperthyroid: suppressed TSH + elevated T3 or TT4
    if tsh_low and (t3_high or tt4_high):
        return 'hyperthyroid'

    # Hypothyroid: elevated TSH + low T3 or TT4
    if tsh_high and (t3_low or tt4_low):
        return 'hypothyroid'

    # Subclinical — TSH out of range but T3/TT4 still normal
    if tsh_high:
        return 'subclinical hypothyroid'
    if tsh_low:
        return 'subclinical hyperthyroid'

    return 'normal'


@prediction_bp.route('/predict', methods=['POST'])
def predict():
    """
    Predict thyroid condition
    ---
    tags:
      - Prediction
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [tsh, t3, tt4]
          properties:
            tsh:
              type: number
              example: 0.05
            t3:
              type: number
              example: 250
            tt4:
              type: number
              example: 15.0
    responses:
      200:
        description: Returns result as normal / hypothyroid / hyperthyroid / subclinical
    """
    data = request.get_json()

    if not data:
        return jsonify({'message': 'No data provided'}), 400

    tsh = data.get('tsh')
    t3  = data.get('t3')
    tt4 = data.get('tt4')

    if tsh is None or t3 is None or tt4 is None:
        return jsonify({'message': 'TSH, T3 and TT4 values are required'}), 400

    try:
        tsh = float(tsh)
        t3  = float(t3)
        tt4 = float(tt4)
    except ValueError:
        return jsonify({'message': 'Invalid values, please enter numbers only'}), 400

    if tsh <= 0 or t3 <= 0 or tt4 <= 0:
        return jsonify({'message': 'All values must be greater than 0'}), 400

    result = classify_thyroid(tsh, t3, tt4)

    return jsonify({
        'result': result,
        'tsh': tsh,
        't3': t3,
        'tt4': tt4
    }), 200