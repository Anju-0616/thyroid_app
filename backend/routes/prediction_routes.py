#prediction_routes.py
from flask import Blueprint, request, jsonify
import joblib
import numpy as np
import os

prediction_bp = Blueprint('prediction', __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model_ML', 'thyroid_model.pkl')

def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None


@prediction_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    tsh = data.get('tsh')
    t3 = data.get('t3')
    tt4 = data.get('tt4')

    if tsh is None or t3 is None or tt4 is None:
        return jsonify({'message': 'TSH, T3 and TT4 values are required'}), 400

    try:
        tsh = float(tsh)
        t3 = float(t3)
        tt4 = float(tt4)
    except ValueError:
        return jsonify({'message': 'Invalid values, please enter numbers only'}), 400

    model = load_model()

    if model:
        input_data = np.array([[tsh, t3, tt4]])
        prediction = model.predict(input_data)[0]
        result = str(prediction)
    else:
        if tsh > 4.5:
            result = 'hypothyroid'
        elif tsh < 0.5:
            result = 'hyperthyroid'
        else:
            result = 'normal'

    return jsonify({
        'result': result,
        'tsh': tsh,
        't3': t3,
        'tt4': tt4
    }), 200