import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [form, setForm] = useState({ region: '', crop: '', stage: '', temp: 0, humidity: 0, rain: 0 });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region: form.region,
        crop: form.crop,
        stage: form.stage,
        temp: Number(form.temp),
        humidity: Number(form.humidity),
        rain: Number(form.rain)
      })
    });
    const data = await res.json();
    setPrediction(data);
  };

  return (
    <div>
      <h1>PestPulse AI Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input name="region" placeholder="Region" onChange={handleChange} />
        <input name="crop" placeholder="Crop" onChange={handleChange} />
        <input name="stage" placeholder="Stage" onChange={handleChange} />
        <input name="temp" type="number" placeholder="Temp" onChange={handleChange} />
        <input name="humidity" type="number" placeholder="Humidity" onChange={handleChange} />
        <input name="rain" type="number" placeholder="Rain" onChange={handleChange} />
        <button type="submit">Predict</button>
      </form>

      {prediction && (
        <div>
          <h2>Risk: {prediction.risk}</h2>
          <p>Reason: {prediction.reason}</p>
        </div>
      )}

      <MapContainer center={[27.7, 85.3]} zoom={7} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {prediction && (
          <Marker position={[27.7, 85.3]}>
            <Popup>{prediction.risk} risk</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default App;
