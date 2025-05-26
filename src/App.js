import React, { useState, useEffect } from 'react';
import './index.css';

const api = {
  key: process.env.REACT_APP_API_KEY,
  base: "https://api.openweathermap.org/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (evt) => {
    if (evt.key === "Enter" && query.trim()) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${api.base}data/2.5/weather?q=${query.trim()}&units=metric&APPID=${api.key}`
        );
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather data');
        }
        
        const result = await response.json();
        setWeather(result);
        setQuery('');
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }
  }

  const dateBuilder = (d) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }

  const getBackgroundClass = () => {
    if (!weather?.main) return 'app';
    return weather.main.temp > 16 ? 'app warm' : 'app';
  }

  return (
    <div className={getBackgroundClass()}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search for a city..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
            disabled={loading}
          />
        </div>

        {loading && (
          <div className="loading">Loading weather data...</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {weather?.main && (
          <div className="weather-container">
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys?.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>

            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°c
                <div className="feels-like">
                  Feels like: {Math.round(weather.main.feels_like)}°c
                </div>
              </div>
              <div className="weather-icon">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                  alt={weather.weather[0].description}
                />
              </div>
              <div className="weather">{weather.weather[0].main}</div>
              <div className="weather-details">
                <div>Humidity: {weather.main.humidity}%</div>
                <div>Wind: {Math.round(weather.wind.speed * 3.6)} km/h</div>
                <div>Pressure: {weather.main.pressure} hPa</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;