import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaTemperatureHigh, FaTemperatureLow, FaWind, FaTint, FaMapMarkerAlt,
    FaSun, FaCloudSun, FaCloud, FaSmog, FaCloudRain, FaBolt,
    FaCalendarAlt, FaArrowRight, FaCheckCircle, FaEye, FaCompass
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

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
    wind_dir?: string;
    vis_km?: number;
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
    const { t } = useTranslation('contact');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `/.netlify/functions/weather?location=${encodeURIComponent(location)}&days=3`
                );
                if (!response.ok) throw new Error('Weather data unavailable');
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

    const getWeatherIcon = (code: number, size: string = "text-5xl"): React.ReactElement => {
        const props = { className: `${size} drop-shadow-lg` };
        switch (code) {
            case 1000: return <FaSun {...props} className={`${props.className} text-amber-400`} />;
            case 1003: return <FaCloudSun {...props} className={`${props.className} text-amber-300`} />;
            case 1006: case 1009: return <FaCloud {...props} className={`${props.className} text-slate-400`} />;
            case 1030: case 1135: case 1147: return <FaSmog {...props} className={`${props.className} text-slate-300`} />;
            case 1063: case 1180: case 1183: case 1186: case 1189: case 1192: case 1195: case 1240: case 1243: case 1246:
                return <FaCloudRain {...props} className={`${props.className} text-sky-400`} />;
            case 1087: case 1273: case 1276: return <FaBolt {...props} className={`${props.className} text-violet-500`} />;
            default: return <FaSun {...props} className={`${props.className} text-amber-400`} />;
        }
    };

    const getDayName = (dateStr: string): string =>
        new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });

    const getSkyGradient = (code: number): string => {
        if (code === 1000) return 'from-sky-300 via-blue-400 to-amber-200';
        if (code === 1003) return 'from-sky-300 via-slate-300 to-amber-100';
        if (code >= 1006 && code <= 1009) return 'from-slate-300 via-slate-400 to-gray-300';
        if (code >= 1030 && code <= 1147) return 'from-gray-300 via-slate-300 to-gray-200';
        if (code >= 1063 || code >= 1180) return 'from-slate-400 via-sky-500 to-blue-400';
        return 'from-sky-300 via-blue-400 to-amber-200';
    };

    const getFarmAdvisory = (data: WeatherData): { icon: React.ReactElement; text: string; color: string } => {
        const { condition, temp_c } = data.current;
        if (condition.code === 1000) return { icon: <FaSun className="text-amber-500" />, text: "Perfect weather for farm operations today!", color: "bg-amber-50 border-amber-200 text-amber-800" };
        if (temp_c > 35) return { icon: <FaTemperatureHigh className="text-red-500" />, text: "High temperatures — ensure workers stay hydrated", color: "bg-red-50 border-red-200 text-red-800" };
        if (condition.text.includes("Rain")) return { icon: <FaCloudRain className="text-sky-600" />, text: "Rain expected — plan indoor tasks accordingly", color: "bg-sky-50 border-sky-200 text-sky-800" };
        return { icon: <FaCheckCircle className="text-emerald-500" />, text: "Good conditions for farm work", color: "bg-emerald-50 border-emerald-200 text-emerald-800" };
    };

    if (loading) {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-blue-50 to-amber-50 p-8 min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-xl" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-sky-300 border-t-transparent animate-spin" />
                    <p className="text-slate-500 font-medium">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (error || !weatherData) {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 to-rose-50 p-8 min-h-[300px] flex items-center justify-center">
                <div className="relative z-10 text-center">
                    <FaCloudRain className="text-5xl text-red-300 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">Unable to load weather data</p>
                </div>
            </div>
        );
    }

    const { current, forecast, location: loc } = weatherData;
    const forecastDays = forecast?.forecastday || [];
    const advisory = getFarmAdvisory(weatherData);

    if (compact) {
        const { current, location: loc } = weatherData;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-4 h-full"
            >
                {/* Subtle sky gradient strip at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getSkyGradient(current.condition.code)}`} />

                <div className="flex items-center gap-4">
                    {/* Icon + Temp */}
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm"
                        >
                            {getWeatherIcon(current.condition.code, "text-2xl")}
                        </motion.div>
                        <div>
                            <div className="text-2xl font-bold text-slate-800">{Math.round(current.temp_c)}°C</div>
                            <div className="text-xs text-slate-400">{current.condition.text}</div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex gap-3 ml-auto">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FaTint className="text-sky-400" /> {current.humidity}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FaWind className="text-slate-400" /> {current.wind_kph}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FaEye className="text-emerald-400" /> {current.uv}
                        </div>
                    </div>

                    {/* Mini 3-day forecast row */}
                    <div className="hidden lg:flex items-center gap-2 border-l border-white/40 pl-4">
                        {forecastDays.slice(0, 3).map((day, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-[10px] text-slate-400">{idx === 0 ? 'Today' : getDayName(day.date).slice(0, 2)}</div>
                                <div className="flex justify-center my-0.5">{getWeatherIcon(day.day.condition.code, "text-sm")}</div>
                                <div className="text-[10px] font-medium">
                                    <span className="text-amber-600">{Math.round(day.day.maxtemp_c)}°</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
            {/* Sky gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getSkyGradient(current.condition.code)} opacity-80`} />

            {/* Cloud-like overlay blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />

            {/* Main glass container */}
            <div className="relative backdrop-blur-xl bg-white/30 border border-white/40 p-6 md:p-8">

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <FaMapMarkerAlt className="text-rose-500 text-lg" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{loc.name}</h2>
                            <p className="text-sm text-slate-500">{loc.region}, {loc.country}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/40 backdrop-blur-sm text-sm font-medium text-slate-600 shadow-sm">
                            {currentTime.toLocaleTimeString('en-US', {
                                timeZone: 'Africa/Abidjan',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-white/40 backdrop-blur-sm text-xs font-medium text-slate-500 shadow-sm">
                            {new Date(loc.localtime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Hero Current Weather Card */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 p-6 mb-6 shadow-lg"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-5">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-2xl bg-white/50 flex items-center justify-center shadow-inner"
                            >
                                {getWeatherIcon(current.condition.code, "text-6xl")}
                            </motion.div>
                            <div>
                                <div className="text-7xl font-light text-slate-800 tracking-tighter">
                                    {Math.round(current.temp_c)}<span className="text-3xl text-slate-400">°C</span>
                                </div>
                                <p className="text-lg font-medium text-slate-600 mt-1">{current.condition.text}</p>
                                <p className="text-sm text-slate-400 mt-0.5">Feels like {Math.round(current.feelslike_c)}°C</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { icon: <FaTint className="text-sky-500" />, label: "Humidity", value: `${current.humidity}%` },
                        { icon: <FaWind className="text-slate-500" />, label: "Wind", value: `${current.wind_kph} km/h` },
                        { icon: <FaEye className="text-emerald-500" />, label: "UV Index", value: `${current.uv}` },
                        { icon: <FaCloud className="text-slate-400" />, label: "Cloud", value: `${current.cloud}%` },
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -3, scale: 1.03 }}
                            className="relative overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-white/40 p-4 shadow-sm group cursor-default"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shadow-sm">
                                        {metric.icon}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{metric.label}</span>
                                </div>
                                <p className="text-2xl font-semibold text-slate-700">{metric.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* 3-Day Forecast */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center shadow-sm">
                            <FaCalendarAlt className="text-sky-600 text-sm" />
                        </div>
                        <h4 className="font-semibold text-slate-700">3-Day Forecast</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {forecastDays.slice(0, 3).map((day, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -4, scale: 1.04 }}
                                className="relative overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-white/40 p-4 text-center shadow-sm group cursor-default"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-300 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="font-semibold text-slate-600 mb-3">{idx === 0 ? 'Today' : getDayName(day.date)}</p>
                                <div className="flex justify-center mb-3">
                                    {getWeatherIcon(day.day.condition.code, "text-4xl")}
                                </div>
                                <p className="text-xs text-slate-400 mb-2">{day.day.condition.text}</p>
                                <div className="flex justify-center gap-4 text-sm font-medium">
                                    <span className="text-amber-600">{Math.round(day.day.maxtemp_c)}°</span>
                                    <span className="text-sky-600">{Math.round(day.day.mintemp_c)}°</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-slate-400">
                                    <FaTint className="text-sky-400" /> {day.day.daily_chance_of_rain}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Farm Advisory Banner */}
                <motion.div
                    whileHover={{ x: 3 }}
                    className={`relative overflow-hidden rounded-xl border ${advisory.color} p-4 flex items-center gap-3 cursor-default`}
                >
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow-sm text-lg">
                            {advisory.icon}
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Farm Advisory</p>
                            <p className="text-sm font-medium">{advisory.text}</p>
                        </div>
                    </div>
                    <FaArrowRight className="relative z-10 ml-auto opacity-50" />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardWeatherWidget;