# PestPulse AI

PestPulse AI predicts pest outbreak risk using weather, crop, and historical data. It provides a dashboard with a map and risk levels, and can send SMS alerts.

## Project Structure

- **frontend**: React app with Leaflet map and form.
- **backend**: Express server that proxies requests to the ML service.
- **ml_model**: Flask app that trains a RandomForest model on sample data and returns predictions.
- **data**: Sample CSV dataset.
- **alerts**: Twilio SMS helper.

## Running Locally

1. Install Python dependencies and start the ML API:

```bash
pip install flask pandas scikit-learn
python ml_model/predict_risk.py
```

2. Install backend dependencies and start Express:

```bash
cd backend
npm install
node app.js
```

3. Install frontend dependencies and start React:

```bash
cd ../frontend
npm install
npm start
```

The dashboard will be available at `http://localhost:3000`.
