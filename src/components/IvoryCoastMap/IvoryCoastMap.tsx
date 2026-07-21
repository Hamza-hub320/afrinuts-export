import React from 'react';
import { motion } from 'framer-motion';
import { GiCargoShip } from 'react-icons/gi';

interface IvoryCoastRouteMapProps {
    className?: string;
}

const IvoryCoastRouteMap: React.FC<IvoryCoastRouteMapProps> = ({ className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`relative ${className}`}
        >
            <svg viewBox="0 0 500 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {/* Gradients */}
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5A7411" stopOpacity="0.8"/>
                        <stop offset="40%" stopColor="#A0C800" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#E04E00" stopOpacity="0.8"/>
                    </linearGradient>
                    <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5A7411" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#E04E00" stopOpacity="0.2"/>
                    </linearGradient>

                    <radialGradient id="odienneGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#E04E00" stopOpacity="0.5"/>
                        <stop offset="50%" stopColor="#E04E00" stopOpacity="0.15"/>
                        <stop offset="100%" stopColor="#E04E00" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="abidjanGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1A5A7A" stopOpacity="0.4"/>
                        <stop offset="50%" stopColor="#1A5A7A" stopOpacity="0.1"/>
                        <stop offset="100%" stopColor="#1A5A7A" stopOpacity="0"/>
                    </radialGradient>

                    {/* Map pattern */}
                    <pattern id="mapGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M40 0L0 0 0 40" fill="none" stroke="#5A7411" strokeWidth="0.5" opacity="0.05"/>
                    </pattern>

                    <filter id="mapShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
                    </filter>
                </defs>

                {/* Background */}
                <rect width="500" height="550" rx="16" fill="#F5F0E8" opacity="0.3"/>
                <rect width="500" height="550" rx="16" fill="url(#mapGrid)"/>

                {/* Map border */}
                <rect x="2" y="2" width="496" height="546" rx="14" fill="none" stroke="#5A7411" strokeWidth="1" opacity="0.15" strokeDasharray="6,4"/>

                {/* ============================================ */}
                {/* COUNTRY SHAPE - Simplified Côte d'Ivoire */}
                {/* ============================================ */}
                <motion.path
                    d="M230,80 C260,55 300,45 330,50 C360,55 390,75 400,105 C410,135 405,175 395,210 C385,245 370,280 350,310 C330,340 305,365 280,385 C255,405 230,420 215,440 C200,460 195,475 200,490 C205,505 220,510 240,500 C260,490 275,470 280,450 C285,430 280,410 270,390 C260,370 240,355 225,335 C210,315 200,290 195,265 C190,240 190,210 195,180 C200,150 205,120 215,95 C220,85 225,80 230,80 Z"
                    fill="white"
                    stroke="#5A7411"
                    strokeWidth="2"
                    filter="url(#mapShadow)"
                    initial={{ pathLength: 0, fill: 'white' }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                    d="M230,80 C260,55 300,45 330,50 C360,55 390,75 400,105 C410,135 405,175 395,210 C385,245 370,280 350,310 C330,340 305,365 280,385 C255,405 230,420 215,440 C200,460 195,475 200,490 C205,505 220,510 240,500 C260,490 275,470 280,450 C285,430 280,410 270,390 C260,370 240,355 225,335 C210,315 200,290 195,265 C190,240 190,210 195,180 C200,150 205,120 215,95 C220,85 225,80 230,80 Z"
                    fill="#5A7411"
                    opacity="0.04"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.04 }}
                    transition={{ delay: 1, duration: 0.5 }}
                />

                {/* ============================================ */}
                {/* ROUTE: ODIENNÉ → ABIDJAN */}
                {/* ============================================ */}

                {/* Route glow */}
                <motion.path
                    d="M230,115 C260,150 290,190 310,230 C330,270 345,310 350,350 C355,390 360,410 370,440"
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 2, ease: 'easeInOut' }}
                />

                {/* Main route path */}
                <motion.path
                    d="M230,115 C260,150 290,190 310,230 C330,270 345,310 350,350 C355,390 360,410 370,440"
                    fill="none"
                    stroke="url(#routeGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8,6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ delay: 0.8, duration: 2, ease: 'easeInOut' }}
                />

                {/* Route milestone dots */}
                {[
                    { x: 250, y: 160, label: 'Korhogo', delay: 1.2 },
                    { x: 285, y: 240, label: 'Bouaké', delay: 1.4 },
                    { x: 315, y: 310, label: 'Yamoussoukro', delay: 1.6 },
                    { x: 340, y: 380, label: 'Agboville', delay: 1.8 },
                ].map((city, i) => (
                    <motion.g
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: city.delay, type: 'spring', stiffness: 300 }}
                    >
                        <circle cx={city.x} cy={city.y} r="3" fill="#A0C800" opacity="0.6"/>
                        <circle cx={city.x} cy={city.y} r="6" fill="#A0C800" opacity="0.15"/>
                        <text x={city.x + 10} y={city.y + 3} fontSize="8" fill="#6b7280" fontWeight="500" opacity="0.7">
                            {city.label}
                        </text>
                    </motion.g>
                ))}

                {/* ============================================ */}
                {/* TRAVELING VEHICLES ALONG THE ROUTE */}
                {/* ============================================ */}

                {/* Truck 1 - Moving along the route */}
                <motion.g
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 0.5 }}
                    style={{ offsetPath: 'path("M230,115 C260,150 290,190 310,230 C330,270 345,310 350,350 C355,390 360,410 370,440")' }}
                >
                    <rect x="-6" y="-8" width="12" height="8" rx="2" fill="#5A7411" opacity="0.8"/>
                    <rect x="-4" y="-10" width="8" height="4" rx="1" fill="#5A7411" opacity="0.6"/>
                    <circle cx="-4" cy="1" r="2" fill="#E04E00" opacity="0.3"/>
                    <circle cx="4" cy="1" r="2" fill="#E04E00" opacity="0.3"/>
                </motion.g>

                {/* Truck 2 - Offset timing */}
                <motion.g
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 2.5 }}
                    style={{ offsetPath: 'path("M230,115 C260,150 290,190 310,230 C330,270 345,310 350,350 C355,390 360,410 370,440")' }}
                >
                    <rect x="-5" y="-7" width="10" height="7" rx="1.5" fill="#A0C800" opacity="0.8"/>
                    <rect x="-3" y="-9" width="7" height="3" rx="1" fill="#A0C800" opacity="0.6"/>
                    <circle cx="-3" cy="1" r="1.5" fill="#E04E00" opacity="0.3"/>
                    <circle cx="3" cy="1" r="1.5" fill="#E04E00" opacity="0.3"/>
                </motion.g>

                {/* Moving dots along route */}
                <motion.circle
                    r="4"
                    fill="#E04E00"
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'linear', delay: 1.5 }}
                    style={{ offsetPath: 'path("M230,115 C260,150 290,190 310,230 C330,270 345,310 350,350 C355,390 360,410 370,440")' }}
                />
                <motion.circle
                    r="3"
                    fill="#5A7411"
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'linear', delay: 2.8 }}
                    style={{ offsetPath: 'path("M230,115 C260,150 290,190 310,230 C330,270 345,310 350,350 C355,390 360,410 370,440")' }}
                />

                {/* ============================================ */}
                {/* ODIENNÉ NODE - Starting Point */}
                {/* ============================================ */}
                <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
                >
                    {/* Glow */}
                    <circle cx="230" cy="115" r="40" fill="url(#odienneGlow)"/>

                    {/* Pulsing rings */}
                    <motion.circle
                        cx="230" cy="115" r="15"
                        fill="none" stroke="#E04E00" strokeWidth="2.5"
                        initial={{ opacity: 0.8, r: 15 }}
                        animate={{ opacity: 0, r: 45 }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
                    />
                    <motion.circle
                        cx="230" cy="115" r="15"
                        fill="none" stroke="#FF6B2B" strokeWidth="2"
                        initial={{ opacity: 0.5, r: 15 }}
                        animate={{ opacity: 0, r: 55 }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeOut', delay: 0.8 }}
                    />

                    {/* Main pin */}
                    <circle cx="230" cy="115" r="10" fill="#E04E00"/>
                    <circle cx="230" cy="115" r="7" fill="white"/>
                    <circle cx="230" cy="115" r="4" fill="#E04E00"/>

                    {/* Label */}
                    <rect x="190" y="132" width="80" height="24" rx="12" fill="white" opacity="0.95" stroke="#E04E00" strokeWidth="1.5"/>
                    <text x="230" y="149" textAnchor="middle" fontSize="11" fill="#E04E00" fontWeight="700">
                        Odienné
                    </text>
                    <text x="230" y="165" textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="500">
                        Farm Origin
                    </text>

                    {/* Connection line */}
                    <line x1="230" y1="125" x2="230" y2="132" stroke="#E04E00" strokeWidth="1.5" opacity="0.6"/>
                </motion.g>

                {/* ============================================ */}
                {/* ABIDJAN PORT NODE - Destination */}
                {/* ============================================ */}
                <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.0, type: 'spring', stiffness: 300 }}
                >
                    {/* Glow */}
                    <circle cx="370" cy="440" r="35" fill="url(#abidjanGlow)"/>

                    {/* Pulsing rings */}
                    <motion.circle
                        cx="370" cy="440" r="14"
                        fill="none" stroke="#1A5A7A" strokeWidth="2.5"
                        initial={{ opacity: 0.8, r: 14 }}
                        animate={{ opacity: 0, r: 40 }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeOut', delay: 0.5 }}
                    />

                    {/* Main pin */}
                    <circle cx="370" cy="440" r="10" fill="#1A5A7A"/>
                    <circle cx="370" cy="440" r="7" fill="white"/>
                    <circle cx="370" cy="440" r="4" fill="#1A5A7A"/>

                    {/* Label */}
                    <rect x="330" y="456" width="80" height="24" rx="12" fill="white" opacity="0.95" stroke="#1A5A7A" strokeWidth="1.5"/>
                    <text x="370" y="473" textAnchor="middle" fontSize="11" fill="#1A5A7A" fontWeight="700">
                        Abidjan
                    </text>
                    <text x="370" y="489" textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="500">
                        Port of Abidjan
                    </text>

                    {/* Ship icon */}
                    <foreignObject x="356" y="426" width="12" height="12">
                        <div className="flex items-center justify-center w-full h-full text-[#1A5A7A]">
                            <GiCargoShip className="text-sm" />
                        </div>
                    </foreignObject>

                    {/* Connection line */}
                    <line x1="370" y1="450" x2="370" y2="456" stroke="#1A5A7A" strokeWidth="1.5" opacity="0.6"/>
                </motion.g>

                {/* ============================================ */}
                {/* LEGEND */}
                {/* ============================================ */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                >
                    <rect x="30" y="480" width="300" height="50" rx="12" fill="white" opacity="0.85" stroke="#5A7411" strokeWidth="0.5"/>

                    {/* Farm Origin */}
                    <circle cx="55" cy="505" r="6" fill="#E04E00"/>
                    <text x="66" y="509" fontSize="9" fill="#6b7280">Farm</text>

                    {/* Route */}
                    <line x1="110" y1="501" x2="140" y2="501" stroke="#5A7411" strokeWidth="2" strokeDasharray="4,3"/>
                    <text x="145" y="509" fontSize="9" fill="#6b7280">Route</text>

                    {/* Destination */}
                    <circle cx="210" cy="505" r="6" fill="#1A5A7A"/>
                    <text x="221" y="509" fontSize="9" fill="#6b7280">Port</text>

                    {/* Truck */}
                    <rect x="270" y="499" width="14" height="8" rx="2" fill="#5A7411"/>
                    <text x="290" y="509" fontSize="9" fill="#6b7280">Export</text>
                </motion.g>

                {/* ============================================ */}
                {/* TOP LABEL */}
                {/* ============================================ */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <text x="250" y="28" textAnchor="middle" fontSize="16" fill="#5A7411" fontWeight="700" letterSpacing="1.5">
                        CÔTE D'IVOIRE
                    </text>
                    <text x="250" y="44" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="400" letterSpacing="0.5">
                        From Odienné to Abidjan Port — Farm OS Tracked
                    </text>
                </motion.g>

                {/* ============================================ */}
                {/* DISTANCE MARKER */}
                {/* ============================================ */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                >
                    <rect x="30" y="56" width="70" height="20" rx="10" fill="white" opacity="0.8" stroke="#5A7411" strokeWidth="0.5"/>
                    <text x="65" y="70" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="500">
                        ~550 km
                    </text>
                </motion.g>

                {/* ============================================ */}
                {/* BOTTOM CAPTION */}
                {/* ============================================ */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4 }}
                    className="text-center text-[10px] text-gray-400 mt-2"
                >
                    Map represents the farm-to-port journey from Odienné to Abidjan Port.
                </motion.p>
            </svg>
        </motion.div>
    );
};

export default IvoryCoastRouteMap;