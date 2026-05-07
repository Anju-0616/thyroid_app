# train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils import resample
import joblib
import os

df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'thyroidDF.csv'))
df = df[['TSH', 'T3', 'TT4', 'target']].copy()
df.dropna(inplace=True)

def map_target(val):
    val = str(val).strip()

    # Codes where TSH is HIGH and T3/TT4 are LOW → hypothyroid
    # These are the codes that in the dataset show TSH median ~2.4, T3 low, TT4 low
    hypothyroid_codes = [
        'K', 'G', 'I', 'F', 'R', 'L', 'M', 'N', 'S',
        'GK', 'J', 'KJ', 'GI', 'H|K', 'FK', 'C|I',
        'Q', 'O', 'P', 'MI', 'OI'
    ]

    # Codes where TSH is LOW and T3/TT4 are HIGH → hyperthyroid
    # These are the codes that show TSH median ~0.07, T3 high, TT4 high
    hyperthyroid_codes = [
        'A', 'B', 'C', 'D', 'AK', 'BK', 'CK', 'DK',
        'MK', 'LJ', 'GKJ', 'D|R', 'E'
    ]

    if val == '-':
        return 'normal'
    elif val in hypothyroid_codes:
        return 'hypothyroid'
    elif val in hyperthyroid_codes:
        return 'hyperthyroid'
    else:
        return 'normal'

df['target'] = df['target'].apply(map_target)

print("Mapped target values:")
print(df['target'].value_counts())
print()
print("TSH medians per class (sanity check):")
print(df.groupby('target')['TSH'].median())
print("Expected: hypothyroid HIGH, hyperthyroid LOW, normal MEDIUM")
print()

# Fix class imbalance — upsample minorities to match normal count
normal     = df[df['target'] == 'normal']
hypo       = df[df['target'] == 'hypothyroid']
hyper      = df[df['target'] == 'hyperthyroid']

target_count = len(normal)

hypo_upsampled  = resample(hypo,  replace=True, n_samples=target_count, random_state=42)
hyper_upsampled = resample(hyper, replace=True, n_samples=target_count, random_state=42)

df_balanced = pd.concat([normal, hypo_upsampled, hyper_upsampled])
df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)

print("Balanced class counts:")
print(df_balanced['target'].value_counts())
print()

X = df_balanced[['TSH', 'T3', 'TT4']]
y = df_balanced['target']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    class_weight='balanced',
    random_state=42
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print()
print("Per-class report:")
print(classification_report(y_test, y_pred))

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'thyroid_model.pkl')
joblib.dump(model, MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")