import pandas as pd
from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Load dataset and train simple model when server starts
DATA_PATH = '../data/pest_data.csv'

def load_model():
    df = pd.read_csv(DATA_PATH)
    X = df[['Region', 'Crop', 'Stage', 'Temp', 'Humidity', 'Rain']]
    y = df['Outbreak']

    cat_features = ['Region', 'Crop', 'Stage']
    numeric_features = ['Temp', 'Humidity', 'Rain']

    preprocessor = ColumnTransformer([
        ('cat', OneHotEncoder(), cat_features)
    ], remainder='passthrough')

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    model = Pipeline(steps=[('preprocess', preprocessor), ('clf', clf)])
    model.fit(X, y)
    return model

model = load_model()

app = Flask(__name__)

RISK_LEVELS = {
    (0.0, 0.3): 'Low',
    (0.3, 0.6): 'Medium',
    (0.6, 1.0): 'High'
}


def classify_risk(prob):
    for (low, high), label in RISK_LEVELS.items():
        if low <= prob < high:
            return label
    return 'Low'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = [[data['region'], data['crop'], data['stage'],
                data['temp'], data['humidity'], data['rain']]]
    prob = model.predict_proba(features)[0][1]
    risk = classify_risk(prob)

    reason = ''
    if data['humidity'] > 80 or data['rain'] > 20:
        reason = 'High humidity or rainfall'
    else:
        reason = 'Favorable conditions'

    return jsonify({'risk': risk, 'probability': prob, 'reason': reason})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
