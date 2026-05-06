import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaTemperatureHigh, FaTemperatureLow, FaWind, FaTint, FaMapMarkerAlt,
    FaSun, FaCloudSun, FaCloud, FaSmog, FaCloudRain, FaBolt,
    FaCalendarAlt, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import weatherSunny from '@/assets/images/weather-sunny.webp';
import weatherPartlyCloudy from '@/assets/images/weather-partly-cloudy.webp';
import weatherCloudy from '@/assets/images/weather-cloudy.webp';
import weatherFog from '@/assets/images/weather-fog.webp';
import weatherRain from '@/assets/images/weather-rain.webp';
import weatherStorm from '@/assets/images/weather-storm.webp';
import weatherSunset from '@/assets/images/weather-sunset.webp';

import weatherClearNight from '@/assets/images/weather-clear-night.webp';
import weatherRainNight from '@/assets/images/weather-rain-night.webp';

interface WeatherDisplayProps {
    location?: string;
    compact?: boolean;
}

interface WeatherCondition {
    text: string;
    code: number;
    icon?: string;
}

interface CurrentWeather {
    condition: WeatherCondition;
    temp_c: number;
    feelslike_c: number;
    wind_kph: number;
    humidity: number;
    uv: number;
    cloud: number;
}

interface ForecastDay {
    date: string;
    day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: WeatherCondition;
        daily_chance_of_rain: number;
        maxwind_kph: number;
        avghumidity: number;
        uv: number;
    };
}

interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
        localtime: string;
    };
    current: CurrentWeather;
    forecast: {
        forecastday: ForecastDay[];
    };
}

const getWeatherBackground = (code: number, isDay: boolean): string => {
    // Clear / Sunny
    if (code === 1000) {
        return isDay ? weatherSunny : weatherClearNight;
    }
    // Partly cloudy
    if (code === 1003) {
        return weatherPartlyCloudy;
    }
    // Cloudy / Overcast
    if ([1006, 1009].includes(code)) {
        return weatherCloudy;
    }
    // Fog / Mist
    if ([1030, 1135, 1147].includes(code)) {
        return weatherFog;
    }
    // Rain / Drizzle
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
        return isDay ? weatherRain : weatherRainNight;
    }
    // Thunderstorm
    if ([1087, 1273, 1276].includes(code)) {
        return weatherStorm;
    }
    // Default fallback
    return weatherSunset;
};


const DashboardWeatherWidget: React.FC<WeatherDisplayProps> = ({ location = "Odienne", compact = false }) => {
    const {t} = useTranslation('contact');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [showMobileWeather, setShowMobileWeather] = useState(false);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `/.netlify/functions/weather?location=${encodeURIComponent(location)}&days=3`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Weather API Error:', errorData);
                    throw new Error(errorData.error?.message || 'Weather data unavailable');
                }

                const data = await response.json();
                setWeatherData(data);
                setLoading(false);
            } catch (err: any) {
                console.error('Weather fetch error:', err);
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

    const getWeatherIcon = (conditionCode: number, className: string = "text-4xl"): React.ReactElement => {
        const iconClass = `${className} transform-gpu group-hover:scale-110 transition-transform duration-300`;
        switch (conditionCode) {
            case 1000:
                return <FaSun className={`${iconClass} text-yellow-400`}/>;
            case 1003:
                return <FaCloudSun className={`${iconClass} text-gray-400`}/>;
            case 1006:
            case 1009:
                return <FaCloud className={`${iconClass} text-gray-500`}/>;
            case 1030:
            case 1135:
            case 1147:
                return <FaSmog className={`${iconClass} text-gray-300`}/>;
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
                return <FaCloudRain className={`${iconClass} text-blue-400`}/>;
            case 1087:
            case 1273:
            case 1276:
                return <FaBolt className={`${iconClass} text-purple-500`}/>;
            default:
                return <FaSun className={`${iconClass} text-yellow-400`}/>;
        }
    };

    const getDayName = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {weekday: 'short'});
    };

    if (loading) {
        return (
            <motion.div
                className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl p-6 backdrop-blur-sm transform-gpu"
                style={{transformStyle: 'preserve-3d', perspective: '1000px'}}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <div
                    className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500"/>
                <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500"/>
                <div className="relative z-10 text-center animate-pulse">
                    Loading weather data...
                </div>
            </motion.div>
        );
    }

    if (error || !weatherData) {
        return (
            <motion.div
                className="relative bg-gradient-to-br from-red-100/80 to-red-200/60 border-2 border-red-300/50 rounded-2xl shadow-xl p-6 backdrop-blur-sm transform-gpu"
                style={{transformStyle: 'preserve-3d', perspective: '1000px'}}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <div
                    className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500"/>
                <div className="relative z-10 text-red-700 text-center">
                    Unable to load weather data
                </div>
            </motion.div>
        );
    }

    const {current, forecast, location: loc} = weatherData;
    const forecastDays = forecast?.forecastday || [];

    const localHour = new Date(loc.localtime).getHours();
    const isDayTime = localHour > 6 && localHour < 18;
    const backgroundImage = getWeatherBackground(current.condition.code, isDayTime);

    if (compact) {
        return (
            <motion.div
                className="group relative overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-500"
                style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.8) 50%, rgba(255,255,255,0.85) 100%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
                }}
                initial={{opacity: 0, scale: 0.92}}
                animate={{opacity: 1, scale: 1}}
                whileHover={{y: -3, scale: 1.01}}
            >
                {/* Subtle sky gradient blob */}
                <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-2xl"
                    style={{background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)'}}
                />
                <div
                    className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-15 blur-2xl"
                    style={{background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)'}}
                />

                <div className="relative z-10 p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"/>
                            <span
                                className="text-xs font-semibold text-gray-600 tracking-wide uppercase">{loc.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono tabular-nums">
                        {currentTime.toLocaleTimeString('en-US', {
                            timeZone: 'Africa/Abidjan',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </span>
                    </div>

                    {/* Main Weather Display */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            {getWeatherIcon(current.condition.code, "text-4xl")}
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-gray-900 leading-none">{current.temp_c}°<span
                                className="text-lg text-gray-400 font-normal">C</span></div>
                            <div className="text-xs text-gray-500 mt-0.5">{current.condition.text}</div>
                            <div className="text-[10px] text-gray-400">Feels like {current.feelslike_c}°C</div>
                        </div>
                    </div>

                    {/* Quick Stats - 2x2 Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[
                            {
                                icon: <FaTint className="text-[10px]"/>,
                                value: `${current.humidity}%`,
                                label: 'Humidity',
                                color: 'text-sky-400'
                            },
                            {
                                icon: <FaWind className="text-[10px]"/>,
                                value: current.wind_kph,
                                label: 'km/h',
                                color: 'text-gray-400'
                            },
                            {
                                icon: <FaTemperatureHigh className="text-[10px]"/>,
                                value: current.uv,
                                label: 'UV',
                                color: 'text-amber-400'
                            },
                            {
                                icon: <FaCloud className="text-[10px]"/>,
                                value: `${current.cloud}%`,
                                label: 'Cloud',
                                color: 'text-gray-400'
                            },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center bg-white/50 rounded-lg py-1.5 px-1">
                                <span className={stat.color}>{stat.icon}</span>
                                <span className="text-xs font-semibold text-gray-700 mt-0.5">{stat.value}</span>
                                <span className="text-[9px] text-gray-400">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* 3-Day Forecast - Compact Pills */}
                    <div className="flex gap-1.5 mb-3">
                        {forecastDays.slice(0, 3).map((day, idx) => (
                            <div
                                key={idx}
                                className="flex-1 text-center bg-white/60 rounded-lg py-2 px-1 transition-all hover:bg-white/80"
                            >
                                <div
                                    className="text-[10px] font-semibold text-gray-500 mb-1">{getDayName(day.date)}</div>
                                {getWeatherIcon(day.day.condition.code, "text-base")}
                                <div className="flex justify-center gap-1 mt-1">
                                    <span
                                        className="text-[10px] font-bold text-gray-800">{Math.round(day.day.maxtemp_c)}°</span>
                                    <span className="text-[10px] text-gray-400">{Math.round(day.day.mintemp_c)}°</span>
                                </div>
                                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                    <FaTint className="text-[8px] text-sky-300"/>
                                    <span className="text-[9px] text-gray-400">{day.day.daily_chance_of_rain}%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Farm Advisory - Compact Badge */}
                    <div
                        className="flex items-center gap-1.5 bg-gradient-to-r from-sky-50 to-amber-50 rounded-full px-3 py-1.5 border border-sky-100">
                    <span className="text-xs">
                        {current.condition.code === 1000 ? '☀️' : current.temp_c > 35 ? '🔥' : current.condition.text.includes("Rain") ? '🌧️' : '✅'}
                    </span>
                        <span className="text-[10px] text-gray-600 font-medium truncate">
                        {current.condition.code === 1000
                            ? 'Perfect farm weather'
                            : current.temp_c > 35
                                ? 'Stay hydrated'
                                : current.condition.text.includes("Rain")
                                    ? 'Rain expected'
                                    : 'Good conditions'
                        }
                    </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="group relative overflow-hidden transition-all duration-500 rounded-2xl shadow-lg transform-gpu"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -3,
                scale: 1.005,
                boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.3 }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Dynamic Weather Background */}
            <div className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out">
                <img
                    src={backgroundImage}
                    alt=""
                    className="w-full h-full object-cover transition-opacity duration-1000"
                    loading="lazy"
                    key={backgroundImage}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/15 to-black/40" />
            </div>

            {/* Glassy content overlay */}
            <div className="absolute inset-0 z-10 backdrop-blur-[0.5px] bg-white/5" />

            {/* 3D edge */}
            <div className="absolute inset-0 rounded-2xl border border-white/15 z-20 pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_6px_rgba(255,255,255,0.08)] z-20 pointer-events-none" />

            <div className="relative z-30 p-4 sm:p-5">
                {/* Header Row - Compact */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-white/70 text-sm" />
                        <span className="text-sm font-semibold text-white/90 drop-shadow-sm">
                        {loc.name}, {loc.country}
                    </span>
                    </div>
                    <span className="text-xs text-white/60 font-mono tabular-nums bg-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm">
                    {currentTime.toLocaleTimeString('en-US', {
                        timeZone: 'Africa/Abidjan',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })}
                </span>
                </div>

                {/* Main Row: Icon + Temp + Stats */}
                <div className="flex items-center gap-5 mb-6">
                    {/* Icon + Temp */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/15 rounded-full blur-xl scale-125" />
                            {getWeatherIcon(current.condition.code, "text-4xl drop-shadow-md")}
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white drop-shadow-md leading-none">
                                {current.temp_c}°<span className="text-lg text-white/60 font-normal">C</span>
                            </div>
                            <div className="text-sm text-white/80 drop-shadow-sm">{current.condition.text}</div>
                            <div className="text-xs text-white/50">Feels like {current.feelslike_c}°C</div>
                        </div>
                    </div>

                    {/* Quick Stats - Inline pills */}
                    <div className="flex gap-2 ml-auto">
                        {[
                            { icon: <FaTint className="text-xs" />, value: `${current.humidity}%`, color: 'text-blue-300' },
                            { icon: <FaWind className="text-xs" />, value: `${current.wind_kph}`, color: 'text-white/80' },
                            { icon: <FaTemperatureHigh className="text-xs" />, value: `${current.uv}`, color: 'text-yellow-300' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10"
                            >
                                <span className={stat.color}>{stat.icon}</span>
                                <span className="text-white/80 text-xs font-medium">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3-Day Forecast - Compact Row */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">3-Day Forecast</span>
                        <FaCalendarAlt className="text-white/40 text-xs" />
                    </div>
                    <div className="flex gap-2">
                        {forecastDays.slice(0, 3).map((day, idx) => (
                            <div
                                key={idx}
                                className="flex-1 bg-white/8 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10 transition-all hover:bg-white/12"
                            >
                                <div className="text-white/50 text-[10px] font-semibold mb-1">{getDayName(day.date)}</div>
                                {getWeatherIcon(day.day.condition.code, "text-lg")}
                                <div className="flex justify-center gap-2 mt-1 text-[11px]">
                                    <span className="text-white/80 font-medium">{Math.round(day.day.maxtemp_c)}°</span>
                                    <span className="text-white/40">{Math.round(day.day.mintemp_c)}°</span>
                                </div>
                                <div className="text-white/30 text-[9px] mt-0.5 flex items-center justify-center gap-0.5">
                                    <FaTint className="text-[8px]" />{day.day.daily_chance_of_rain}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Farm Advisory - Subtle */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <span className="text-xs text-white/60 flex items-center gap-1.5">
                    {current.condition.code === 1000
                        ? <><FaSun className="text-yellow-400/80 text-[10px]" /> Perfect farm weather</>
                        : current.temp_c > 35
                            ? <><FaTemperatureHigh className="text-red-400/80 text-[10px]" /> Stay hydrated</>
                            : current.condition.text.includes("Rain")
                                ? <><FaCloudRain className="text-blue-300/80 text-[10px]" /> Rain expected</>
                                : <><FaCheckCircle className="text-green-400/80 text-[10px]" /> Good conditions</>
                    }
                </span>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardWeatherWidget;