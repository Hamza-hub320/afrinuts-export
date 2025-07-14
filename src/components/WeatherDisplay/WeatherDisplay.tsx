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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Weather data not available');
        }

        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err: any) {
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
      case 1000: return <WiDaySunny className="text-5xl text-yellow-400" />;
      case 1003: return <WiDayCloudy className="text-5xl text-gray-400" />;
      case 1006:
      case 1009: return <WiCloudy className="text-5xl text-gray-500" />;
      case 1030:
      case 1135:
      case 1147: return <WiDayCloudy className="text-5xl text-gray-300" />;
      case 1063:
      case 1180:
      case 1183:
      case 1186:
      case 1189:
      case 1192:
      case 1195:
      case 1240:
      case 1243:
      case 1246: return <WiRain className="text-5xl text-blue-400" />;
      case 1087:
      case 1273:
      case 1276: return <WiThunderstorm className="text-5xl text-purple-500" />;
      default: return <WiDaySunny className="text-5xl text-yellow-400" />;
    }
  };

  if (loading) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center animate-pulse">
          Loading weather data...
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          Weather data unavailable
        </div>
    );
  }

  return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Current Weather in {location}</h3>
          <div className="text-sm font-medium text-gray-600">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </div>
        </div>

        {weatherData && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                {getWeatherIcon(weatherData.current.condition.code)}
                <span className="text-lg font-medium text-gray-700">
              {weatherData.current.condition.text}
            </span>
              </div>

              <div className="text-center space-y-1">
                <div className="text-4xl font-bold text-gray-900">
                  {weatherData.current.temp_c}°C
                </div>
                <div className="text-sm text-gray-500">
                  Feels like: {weatherData.current.feelslike_c}°C
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center space-x-2">
                  <FaTemperatureHigh className="text-orange-500" />
                  <span className="text-sm text-gray-700">
                High: {weatherData.forecast?.forecastday[0]?.day.maxtemp_c ?? 'N/A'}°C
              </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTemperatureLow className="text-blue-500" />
                  <span className="text-sm text-gray-700">
                Low: {weatherData.forecast?.forecastday[0]?.day.mintemp_c ?? 'N/A'}°C
              </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaWind className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                Wind: {weatherData.current.wind_kph} km/h
              </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTint className="text-blue-300" />
                  <span className="text-sm text-gray-700">
                Humidity: {weatherData.current.humidity}%
              </span>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default WeatherDisplay;