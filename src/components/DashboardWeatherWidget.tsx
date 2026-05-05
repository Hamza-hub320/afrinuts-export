import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaTemperatureHigh, FaTemperatureLow, FaWind, FaTint, FaMapMarkerAlt,
    FaSun, FaCloudSun, FaCloud, FaSmog, FaCloudRain, FaBolt,
    FaCalendarAlt, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import weatherSunsetBg from '@/assets/images/weather-sunset.webp';

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
            className="group relative overflow-hidden transition-all duration-500 rounded-2xl shadow-xl transform-gpu"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -6,
                scale: 1.01,
                boxShadow: '0 25px 40px -12px rgba(0, 0, 0, 0.25)',
                transition: {duration: 0.3}
            }}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            {/* Sunset Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={weatherSunsetBg}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"/>
                {/* Warm amber overlay matching brand */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent"/>
            </div>

            {/* Animated floating orbs */}
            <div className="absolute top-20 right-16 w-4 h-4 rounded-full bg-yellow-200/40 blur-sm animate-pulse z-10"/>
            <div className="absolute top-32 right-24 w-2 h-2 rounded-full bg-orange-200/30 blur-sm animate-pulse z-10"
                 style={{animationDelay: '1s'}}/>

            {/* Glassy content overlay */}
            <div className="absolute inset-0 z-10 backdrop-blur-[1px] bg-white/5"/>

            {/* 3D edge effect */}
            <div
                className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500 z-20 pointer-events-none"/>
            <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500 z-20 pointer-events-none"/>
            <div
                className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(255,255,255,0.1)] group-hover:shadow-[inset_0_4px_16px_rgba(255,255,255,0.15)] transition-shadow duration-500 z-20 pointer-events-none"/>

            <div className="relative z-30 p-6 sm:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <FaMapMarkerAlt className="text-white text-lg"/>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white drop-shadow-md">
                                {loc.name}
                            </h3>
                            <p className="text-sm text-white/80 drop-shadow-sm">
                                {loc.region}, {loc.country}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                    <span className="text-white font-mono text-sm tabular-nums drop-shadow-sm">
                        {currentTime.toLocaleTimeString('en-US', {
                            timeZone: 'Africa/Abidjan',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </span>
                    </div>
                </div>

                {/* Current Weather - Hero Display */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div
                                className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150 animate-pulse"/>
                            {getWeatherIcon(current.condition.code, "text-7xl drop-shadow-lg")}
                        </div>
                        <div>
                            <div className="text-7xl font-bold text-white drop-shadow-lg leading-none">
                                {current.temp_c}°<span className="text-3xl text-white/80 font-normal">C</span>
                            </div>
                            <div className="text-xl text-white/90 drop-shadow-md mt-1 font-medium">
                                {current.condition.text}
                            </div>
                            <div className="text-sm text-white/70 drop-shadow-sm mt-1">
                                Feels like {current.feelslike_c}°C
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats - 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                        {[
                            {icon: <FaTint/>, value: `${current.humidity}%`, label: 'Humidity', color: 'text-blue-300'},
                            {icon: <FaWind/>, value: `${current.wind_kph} km/h`, label: 'Wind', color: 'text-white'},
                            {
                                icon: <FaTemperatureHigh/>,
                                value: `UV ${current.uv}`,
                                label: 'UV Index',
                                color: 'text-yellow-300'
                            },
                            {
                                icon: <FaCloud/>,
                                value: `${current.cloud}%`,
                                label: 'Cloud Cover',
                                color: 'text-gray-300'
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl py-3 px-4 border border-white/20 min-w-[100px]"
                                whileHover={{scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)'}}
                                transition={{duration: 0.2}}
                            >
                                <span className={`${stat.color} text-lg mb-1 drop-shadow-md`}>{stat.icon}</span>
                                <span className="text-white font-bold text-sm drop-shadow-md">{stat.value}</span>
                                <span className="text-white/60 text-xs drop-shadow-sm">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 3-Day Forecast */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FaCalendarAlt className="text-white/80"/>
                        <h4 className="font-semibold text-white/90 text-lg drop-shadow-sm">3-Day Forecast</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {forecastDays.slice(0, 3).map((day, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 transition-all"
                                whileHover={{y: -4, scale: 1.03, backgroundColor: 'rgba(255,255,255,0.18)'}}
                                transition={{duration: 0.2}}
                            >
                                <div className="text-white/80 font-semibold mb-2 text-sm drop-shadow-sm">
                                    {getDayName(day.date)}
                                </div>
                                <div className="flex justify-center mb-2">
                                    {getWeatherIcon(day.day.condition.code, "text-3xl drop-shadow-md")}
                                </div>
                                <div
                                    className="text-white/70 text-xs mb-2 drop-shadow-sm">{day.day.condition.text}</div>
                                <div className="flex justify-center gap-3 text-sm">
                                <span className="text-yellow-300 font-bold drop-shadow-sm">
                                    {Math.round(day.day.maxtemp_c)}°
                                </span>
                                    <span className="text-blue-300 font-bold drop-shadow-sm">
                                    {Math.round(day.day.mintemp_c)}°
                                </span>
                                </div>
                                <div className="text-white/50 text-xs mt-2 flex items-center justify-center gap-1">
                                    <FaTint className="text-blue-300/70"/>
                                    <span className="drop-shadow-sm">{day.day.daily_chance_of_rain}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Farm Advisory */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-2 text-sm text-white/90">
                        <FaArrowRight className="text-yellow-300"/>
                        <span className="flex items-center gap-1.5 drop-shadow-sm">
                        {current.condition.code === 1000
                            ? <><FaSun className="text-yellow-400"/> Perfect weather for farm operations today!</>
                            : current.temp_c > 35
                                ? <><FaTemperatureHigh className="text-red-400"/> High temperatures - ensure workers
                                    stay hydrated</>
                                : current.condition.text.includes("Rain")
                                    ? <><FaCloudRain className="text-blue-300"/> Rain expected - plan indoor tasks
                                        accordingly</>
                                    : <><FaCheckCircle className="text-green-400"/> Good conditions for farm work</>
                        }
                    </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardWeatherWidget;