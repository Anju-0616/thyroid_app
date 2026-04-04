import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'thyroidDF.csv'))

df = df[['TSH', 'T3', 'TT4', 'target']].copy()
df.dropna(inplace=True)

def map_target(val):
    val = str(val).strip()
    hypothyroid_codes = ['A', 'B', 'C', 'D', 'AK', 'BK', 'CK', 'DK', 'MK', 'LJ', 'GKJ']
    hyperthyroid_codes = ['C|I', 'D|R', 'E', 'F', 'FK', 'G', 'GI', 'GK', 'H|K', 'I', 'J', 'K', 'KJ', 'L', 'M', 'MI', 'N', 'O', 'OI', 'P', 'Q', 'R', 'S']
    if val == '-':
        return 'normal'
    elif val in hypothyroid_codes:
        return 'hypothyroid'
    elif val in hyperthyroid_codes:
        return 'hyperthyroid'
    else:
        return 'normal'

df['target'] = df['target'].apply(map_target)

print("Mapped target values:", df['target'].value_counts())

X = df[['TSH', 'T3', 'TT4']]
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'thyroid_model.pkl')
joblib.dump(model, MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")