// src/components/WeatherDisplay/WeatherDisplay.tsx
import React, { useState, useEffect } from 'react';
import {
  WiDaySunny, WiRain, WiCloudy, WiDayCloudy, WiThunderstorm
} from 'react-icons/wi';
import {
  FaTemperatureHigh, FaTemperatureLow, FaWind, FaTint
} from 'react-icons/fa';

interface WeatherDisplayProps {
  location?: string;
}

interface WeatherCondition {
  text: string;
  code: number;
}

interface WeatherData {
  current: {
    condition: WeatherCondition;
    temp_c: number;
    feelslike_c: number;
    wind_kph: number;
    humidity: number;
  };
  forecast?: {
    forecastday: Array<{
      day: {
        maxtemp_c: number;
        mintemp_c: number;
      };
    }>;
  };
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ location = "Odienne" }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchWeather = async () => {
      try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=1441099e284b49248f291111250506&q=${location}&days=1&aqi=no`
        );

        console.log("API response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          throw new Error(errorData.error?.message || 'Weather data not available');
        }

        const data = await response.json();
        console.log("API data received:", data);
        setWeatherData(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();

    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, [location]);

  const getWeatherIcon = (conditionCode: number): JSX.Element => {
    switch (conditionCode) {
      case 1000:
        return <WiDaySunny className="weather-icon" />;
      case 1003:
        return <WiDayCloudy className="weather-icon" />;
      case 1006:
      case 1009:
        return <WiCloudy className="weather-icon" />;
      case 1030:
      case 1135:
      case 1147:
        return <WiDayCloudy className="weather-icon" />;
      case 1063:
      case 1180:
      case 1183:
      case 1186:
      case 1189:
      case 1192:
      case 1195:
      case 1240:
      case 1243:
      case 1246:
        return <WiRain className="weather-icon" />;
      case 1087:
      case 1273:
      case 1276:
        return <WiThunderstorm className="weather-icon" />;
      default:
        return <WiDaySunny className="weather-icon" />;
    }
  };

  if (loading) {
    return <div className="weather-loading">Loading weather data...</div>;
  }

  if (error) {
    return <div className="weather-error">Weather data unavailable</div>;
  }

  return (
      <div className="weather-display">
        <div className="weather-header">
          <h3>Current Weather in {location}</h3>
          <div className="current-time">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </div>
        </div>

        <div className="weather-main">
          {weatherData && (
              <>
                <div className="weather-condition">
                  {getWeatherIcon(weatherData.current.condition.code)}
                  <span>{weatherData.current.condition.text}</span>
                </div>

                <div className="weather-temp">
                  <span className="temp-value">{weatherData.current.temp_c}°C</span>
                  <span className="temp-feels">
                Feels like: {weatherData.current.feelslike_c}°C
              </span>
                </div>

                <div className="weather-details">
                  <div className="detail-item">
                    <FaTemperatureHigh />
                    <span>
                  High:{' '}
                      {weatherData.forecast?.forecastday[0]?.day.maxtemp_c ?? 'N/A'}°C
                </span>
                  </div>
                  <div className="detail-item">
                    <FaTemperatureLow />
                    <span>
                  Low:{' '}
                      {weatherData.forecast?.forecastday[0]?.day.mintemp_c ?? 'N/A'}°C
                </span>
                  </div>
                  <div className="detail-item">
                    <FaWind />
                    <span>Wind: {weatherData.current.wind_kph} km/h</span>
                  </div>
                  <div className="detail-item">
                    <FaTint />
                    <span>Humidity: {weatherData.current.humidity}%</span>
                  </div>
                </div>
              </>
          )}
        </div>
      </div>
  );
};

export default WeatherDisplay;