# prediction_routes.py
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


def rule_based_prediction(tsh, t3, tt4):
    # Proper thyroid classification logic
    if tsh > 4.5:
        if t3 < 80 or tt4 < 5.0:
            return 'hypothyroid'
        else:
            return 'subclinical hypothyroid'

    elif tsh < 0.4:
        if t3 > 200 or tt4 > 12.0:
            return 'hyperthyroid'
        else:
            return 'subclinical hyperthyroid'

    else:
        return 'normal'


@prediction_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    tsh = data.get('tsh')
    t3 = data.get('t3')
    tt4 = data.get('tt4')

    # Validate input
    if tsh is None or t3 is None or tt4 is None:
        return jsonify({'message': 'TSH, T3 and TT4 values are required'}), 400

    try:
        tsh = float(tsh)
        t3 = float(t3)
        tt4 = float(tt4)
    except ValueError:
        return jsonify({'message': 'Invalid values, please enter numbers only'}), 400

    model = load_model()

    # Default to rule-based prediction
    result = rule_based_prediction(tsh, t3, tt4)

    # Try ML model (but validate output)
    if model:
        try:
            input_data = np.array([[tsh, t3, tt4]])
            prediction = model.predict(input_data)[0]

            print("Model Prediction:", prediction)  # debug

            # Accept only valid outputs
            valid_outputs = [
                'normal',
                'hypothyroid',
                'hyperthyroid',
                'subclinical hypothyroid',
                'subclinical hyperthyroid'
            ]

            if str(prediction).lower() in valid_outputs:
                result = str(prediction).lower()

        except Exception as e:
            print("Model error:", e)
            # fallback already handled

    return jsonify({
        'result': result,
        'tsh': tsh,
        't3': t3,
        'tt4': tt4
    }), 200