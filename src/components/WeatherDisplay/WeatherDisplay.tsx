import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTemperatureHigh, FaTemperatureLow, FaWind, FaTint, FaMapMarkerAlt,
  FaSun, FaCloudSun, FaCloud, FaSmog, FaCloudRain, FaBolt
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('contact');
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
            `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${location}&days=1&aqi=no`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Weather API Error:', errorData);
          throw new Error(errorData.error?.message || t('error'));
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
  }, [location, t]);

  const getWeatherIcon = (conditionCode: number): JSX.Element => {
    switch (conditionCode) {
      case 1000:
        return <FaSun className="text-5xl text-yellow-400 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
      case 1003:
        return <FaCloudSun className="text-5xl text-gray-400 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
      case 1006:
      case 1009:
        return <FaCloud className="text-5xl text-gray-500 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
      case 1030:
      case 1135:
      case 1147:
        return <FaSmog className="text-5xl text-gray-300 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
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
        return <FaCloudRain className="text-5xl text-blue-400 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
      case 1087:
      case 1273:
      case 1276:
        return <FaBolt className="text-5xl text-purple-500 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <FaSun className="text-5xl text-yellow-400 transform-gpu group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  if (loading) {
    return (
        <motion.div
            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl p-6 backdrop-blur-sm transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          {/* 3D effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500" />

          {/* Glassy overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500" />

          <div className="relative z-10 text-center animate-pulse">
            {t('weather.loading')}
          </div>
        </motion.div>
    );
  }

  if (error) {
    return (
        <motion.div
            className="relative bg-gradient-to-br from-red-100/80 to-red-200/60 border-2 border-red-300/50 rounded-2xl shadow-xl p-6 backdrop-blur-sm transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          {/* 3D effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500" />

          <div className="relative z-10 text-red-700">
            {t('weather.error')}
          </div>
        </motion.div>
    );
  }

  return (
      <motion.div
          className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-xl p-6 backdrop-blur-sm transform-gpu"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
            rotateY: 2,
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 }
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
      >
        {/* 3D edge effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

        {/* Glassy overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Inner shadow effect */}
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

        {/* Subtle background pattern */}
        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-accent transform-gpu group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-gray-800">
                {t('weather.currentWeather', { location })}
              </h3>
            </div>
            <div className="text-sm font-medium text-gray-600 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full transform-gpu group-hover:scale-105 transition-transform duration-300">
              {currentTime.toLocaleTimeString('en-US', {
                timeZone: 'Africa/Abidjan',
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
                  <span className="text-lg font-medium text-gray-700 transform-gpu group-hover:scale-105 transition-transform duration-300">
                {weatherData.current.condition.text}
              </span>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-4xl font-bold text-gray-900 transform-gpu group-hover:scale-105 transition-transform duration-300">
                    {weatherData.current.temp_c}°C
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('weather.feelsLike', { temp: weatherData.current.feelslike_c })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <motion.div
                      className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm p-2 rounded-lg transform-gpu hover:scale-105 transition-transform duration-300"
                      whileHover={{ x: 3 }}
                  >
                    <FaTemperatureHigh className="text-orange-500" />
                    <span className="text-sm text-gray-700">
                  {t('weather.highTemp', { temp: weatherData.forecast?.forecastday[0]?.day.maxtemp_c ?? t('weather.notAvailable') })}
                </span>
                  </motion.div>
                  <motion.div
                      className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm p-2 rounded-lg transform-gpu hover:scale-105 transition-transform duration-300"
                      whileHover={{ x: 3 }}
                  >
                    <FaTemperatureLow className="text-blue-500" />
                    <span className="text-sm text-gray-700">
                  {t('weather.lowTemp', { temp: weatherData.forecast?.forecastday[0]?.day.mintemp_c ?? t('weather.notAvailable') })}
                </span>
                  </motion.div>
                  <motion.div
                      className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm p-2 rounded-lg transform-gpu hover:scale-105 transition-transform duration-300"
                      whileHover={{ x: 3 }}
                  >
                    <FaWind className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                  {t('weather.wind', { speed: weatherData.current.wind_kph })}
                </span>
                  </motion.div>
                  <motion.div
                      className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm p-2 rounded-lg transform-gpu hover:scale-105 transition-transform duration-300"
                      whileHover={{ x: 3 }}
                  >
                    <FaTint className="text-blue-300" />
                    <span className="text-sm text-gray-700">
                  {t('weather.humidity', { percent: weatherData.current.humidity })}
                </span>
                  </motion.div>
                </div>
              </div>
          )}
        </div>
      </motion.div>
  );
};

export default WeatherDisplay;