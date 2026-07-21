import React from 'react';
import { motion } from 'framer-motion';
import { FaTree, FaUsers, FaHandshake, FaIndustry, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { GiFruitTree } from 'react-icons/gi';

const SupplyChainMapSVG: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-gradient-to-br from-primary/5 via-white/60 to-accent/5 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl p-6"
            >
                <svg viewBox="0 0 1000 650" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Map-like background gradient */}
                        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E8F0D6" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#F5F0E8" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#E8F0D6" stopOpacity="0.3" />
                        </linearGradient>

                        {/* Terrain patterns */}
                        <pattern id="terrain" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="15" cy="15" r="12" fill="#5A7411" opacity="0.03" />
                            <circle cx="45" cy="45" r="8" fill="#5A7411" opacity="0.02" />
                            <circle cx="30" cy="30" r="18" fill="#8AA82A" opacity="0.02" />
                        </pattern>

                        {/* Node gradients */}
                        <radialGradient id="nodeFarmGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#5A7411" />
                            <stop offset="100%" stopColor="#8AA82A" />
                        </radialGradient>
                        <radialGradient id="nodeCoopGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#A0C800" />
                            <stop offset="100%" stopColor="#C4E844" />
                        </radialGradient>
                        <radialGradient id="nodeNdcGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#E04E00" />
                            <stop offset="100%" stopColor="#FF6B2B" />
                        </radialGradient>

                        {/* Glow filter */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>

                        {/* Drop shadow */}
                        <filter id="shadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                        </filter>
                    </defs>

                    {/* ============================================ */}
                    {/* MAP BACKGROUND */}
                    {/* ============================================ */}
                    <rect x="0" y="0" width="1000" height="650" rx="20" fill="url(#mapBg)" />
                    <rect x="0" y="0" width="1000" height="650" rx="20" fill="url(#terrain)" />

                    {/* Map border/outline */}
                    <path
                        d="M40,40 L960,40 L960,610 L40,610 Z"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="1"
                        strokeDasharray="8,4"
                        opacity="0.15"
                    />

                    {/* ============================================ */}
                    {/* MAP TITLE */}
                    {/* ============================================ */}
                    <g>
                        <text x="500" y="50" textAnchor="middle" fontSize="16" fill="#5A7411" fontWeight="700" letterSpacing="1.5">
                            ODIENNÉ SUPPLY NETWORK
                        </text>
                        <text x="500" y="68" textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="400" letterSpacing="0.5">
                            Cashew sourcing from farmers to AfriNuts NDC — digitally tracked with Farm OS
                        </text>
                    </g>

                    {/* ============================================ */}
                    {/* REGION LABELS */}
                    {/* ============================================ */}
                    <g opacity="0.15">
                        <text x="150" y="120" fontSize="20" fill="#5A7411" fontWeight="700" transform="rotate(-15, 150, 120)">Odienné</text>
                        <text x="650" y="580" fontSize="18" fill="#5A7411" fontWeight="700" transform="rotate(10, 650, 580)">Tengréla</text>
                        <text x="800" y="200" fontSize="16" fill="#5A7411" fontWeight="700" transform="rotate(-5, 800, 200)">M'Bengué</text>
                        <text x="100" y="550" fontSize="14" fill="#5A7411" fontWeight="700" transform="rotate(-20, 100, 550)">Boundiali</text>
                    </g>

                    {/* ============================================ */}
                    {/* ROADS / ROUTES - Connecting lines */}
                    {/* ============================================ */}

                    {/* Main road - from farms to NDC */}
                    <path
                        d="M200,400 C300,350 350,300 420,280 C480,260 520,260 580,280 C640,300 680,320 720,340"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="3"
                        strokeDasharray="8,6"
                        opacity="0.3"
                    />
                    <path
                        d="M200,200 C300,220 380,240 450,250 C520,260 560,260 620,270 C680,280 720,300 750,320"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="3"
                        strokeDasharray="8,6"
                        opacity="0.3"
                    />
                    <path
                        d="M600,150 C650,180 680,210 720,250 C740,280 750,300 760,320"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="3"
                        strokeDasharray="8,6"
                        opacity="0.25"
                    />
                    <path
                        d="M300,500 C380,450 440,400 480,360 C520,330 560,310 600,300"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="3"
                        strokeDasharray="8,6"
                        opacity="0.25"
                    />
                    <path
                        d="M150,350 C220,330 280,310 340,290 C400,270 460,260 520,260"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="2.5"
                        strokeDasharray="6,5"
                        opacity="0.2"
                    />

                    {/* ============================================ */}
                    {/* NODE 1: FARM A - Top Left */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        {/* Terrain circle */}
                        <circle cx="180" cy="200" r="50" fill="#5A7411" opacity="0.04" />

                        {/* Node */}
                        <circle cx="180" cy="200" r="28" fill="white" stroke="url(#nodeFarmGrad)" strokeWidth="3" />
                        <circle cx="180" cy="200" r="28" fill="url(#nodeFarmGrad)" opacity="0.1" />

                        <foreignObject x="166" y="186" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full text-primary">
                                <FaTree className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="180" y="240" textAnchor="middle" fontSize="11" fill="#5A7411" fontWeight="700">Farm A</text>
                        <text x="180" y="254" textAnchor="middle" fontSize="8" fill="#6b7280">5 km · 12 farmers</text>

                        <motion.circle
                            cx="180" cy="200" r="28"
                            fill="none" stroke="#5A7411" strokeWidth="1.5"
                            initial={{ opacity: 0.6, r: 28 }}
                            animate={{ opacity: 0, r: 48 }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 2: FARM B - Bottom Left */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="200" cy="400" r="50" fill="#5A7411" opacity="0.04" />
                        <circle cx="200" cy="400" r="28" fill="white" stroke="url(#nodeFarmGrad)" strokeWidth="3" />
                        <circle cx="200" cy="400" r="28" fill="url(#nodeFarmGrad)" opacity="0.1" />

                        <foreignObject x="186" y="386" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full text-primary">
                                <FaTree className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="200" y="440" textAnchor="middle" fontSize="11" fill="#5A7411" fontWeight="700">Farm B</text>
                        <text x="200" y="454" textAnchor="middle" fontSize="8" fill="#6b7280">8 km · 8 farmers</text>

                        <motion.circle
                            cx="200" cy="400" r="28"
                            fill="none" stroke="#5A7411" strokeWidth="1.5"
                            initial={{ opacity: 0.6, r: 28 }}
                            animate={{ opacity: 0, r: 48 }}
                            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeOut', delay: 0.4 }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 3: CO-OP A - Top Right */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="600" cy="150" r="50" fill="#A0C800" opacity="0.04" />
                        <circle cx="600" cy="150" r="28" fill="white" stroke="url(#nodeCoopGrad)" strokeWidth="3" />
                        <circle cx="600" cy="150" r="28" fill="url(#nodeCoopGrad)" opacity="0.1" />

                        <foreignObject x="586" y="136" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#A0C800' }}>
                                <FaUsers className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="600" y="190" textAnchor="middle" fontSize="11" fill="#A0C800" fontWeight="700">Co-op A</text>
                        <text x="600" y="204" textAnchor="middle" fontSize="8" fill="#6b7280">3 km · 24 farmers</text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 4: CO-OP B - Bottom Right */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="650" cy="480" r="50" fill="#A0C800" opacity="0.04" />
                        <circle cx="650" cy="480" r="28" fill="white" stroke="url(#nodeCoopGrad)" strokeWidth="3" />
                        <circle cx="650" cy="480" r="28" fill="url(#nodeCoopGrad)" opacity="0.1" />

                        <foreignObject x="636" y="466" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#A0C800' }}>
                                <FaHandshake className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="650" y="520" textAnchor="middle" fontSize="11" fill="#A0C800" fontWeight="700">Co-op B</text>
                        <text x="650" y="534" textAnchor="middle" fontSize="8" fill="#6b7280">15 km · 18 farmers</text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 5: FARM C - Middle Center */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.3, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="380" cy="350" r="50" fill="#5A7411" opacity="0.04" />
                        <circle cx="380" cy="350" r="28" fill="white" stroke="url(#nodeFarmGrad)" strokeWidth="3" />
                        <circle cx="380" cy="350" r="28" fill="url(#nodeFarmGrad)" opacity="0.1" />

                        <foreignObject x="366" y="336" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full text-primary">
                                <GiFruitTree className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="380" y="390" textAnchor="middle" fontSize="11" fill="#5A7411" fontWeight="700">Farm C</text>
                        <text x="380" y="404" textAnchor="middle" fontSize="8" fill="#6b7280">12 km · 6 farmers</text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 6: AFRINUTS NDC (HUB) - Center Right */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        {/* Large glow ring */}
                        <circle cx="780" cy="320" r="80" fill="#E04E00" opacity="0.04" />
                        <circle cx="780" cy="320" r="60" fill="url(#nodeNdcGrad)" opacity="0.06" />

                        {/* Main node - larger */}
                        <circle cx="780" cy="320" r="40" fill="white" stroke="url(#nodeNdcGrad)" strokeWidth="4" />
                        <circle cx="780" cy="320" r="40" fill="url(#nodeNdcGrad)" opacity="0.1" />

                        <foreignObject x="762" y="302" width="36" height="36">
                            <div className="flex items-center justify-center w-full h-full text-accent">
                                <FaIndustry className="text-xl" />
                            </div>
                        </foreignObject>

                        {/* NDC Label */}
                        <text x="780" y="372" textAnchor="middle" fontSize="14" fill="#E04E00" fontWeight="800" letterSpacing="0.5">
                            AFRINUTS NDC
                        </text>
                        <text x="780" y="388" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="500">
                            Nuts Distribution Center
                        </text>

                        {/* Pulsing ring */}
                        <motion.circle
                            cx="780" cy="320" r="40"
                            fill="none" stroke="#E04E00" strokeWidth="2"
                            initial={{ opacity: 0.8, r: 40 }}
                            animate={{ opacity: 0, r: 70 }}
                            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeOut', delay: 0.5 }}
                        />

                        {/* Second pulsing ring */}
                        <motion.circle
                            cx="780" cy="320" r="40"
                            fill="none" stroke="#FF6B2B" strokeWidth="1.5"
                            initial={{ opacity: 0.5, r: 40 }}
                            animate={{ opacity: 0, r: 90 }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeOut', delay: 1 }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* TRAVELING DOTS - From Farms to NDC */}
                    {/* ============================================ */}

                    {/* From Farm A to NDC */}
                    <motion.circle
                        r="5"
                        fill="#5A7411"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 0.5 }}
                        style={{ offsetPath: 'path("M200,200 C300,220 380,240 450,250 C520,260 560,260 620,270 C680,280 720,300 750,320")' }}
                    />
                    <motion.circle
                        r="3"
                        fill="#A0C800"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'linear', delay: 1.2 }}
                        style={{ offsetPath: 'path("M200,200 C300,220 380,240 450,250 C520,260 560,260 620,270 C680,280 720,300 750,320")' }}
                    />

                    {/* From Farm B to NDC */}
                    <motion.circle
                        r="5"
                        fill="#5A7411"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 7, ease: 'linear', delay: 0.8 }}
                        style={{ offsetPath: 'path("M200,400 C300,350 350,300 420,280 C480,260 520,260 580,280 C640,300 680,320 720,340")' }}
                    />
                    <motion.circle
                        r="3"
                        fill="#E04E00"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 1.5 }}
                        style={{ offsetPath: 'path("M200,400 C300,350 350,300 420,280 C480,260 520,260 580,280 C640,300 680,320 720,340")' }}
                    />

                    {/* From Co-op A to NDC */}
                    <motion.circle
                        r="4"
                        fill="#A0C800"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 5.5, ease: 'linear', delay: 1.0 }}
                        style={{ offsetPath: 'path("M600,150 C650,180 680,210 720,250 C740,280 750,300 760,320")' }}
                    />

                    {/* From Co-op B to NDC */}
                    <motion.circle
                        r="4"
                        fill="#A0C800"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 6.5, ease: 'linear', delay: 1.3 }}
                        style={{ offsetPath: 'path("M650,480 C620,440 580,400 540,360 C500,330 460,310 420,300")' }}
                    />
                    <motion.circle
                        r="3"
                        fill="#E04E00"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'linear', delay: 2.0 }}
                        style={{ offsetPath: 'path("M650,480 C620,440 580,400 540,360 C500,330 460,310 420,300")' }}
                    />

                    {/* From Farm C to NDC */}
                    <motion.circle
                        r="4"
                        fill="#5A7411"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 5.8, ease: 'linear', delay: 0.7 }}
                        style={{ offsetPath: 'path("M380,350 C440,330 500,310 560,300 C620,290 680,300 740,310")' }}
                    />

                    {/* ============================================ */}
                    {/* NODE LABELS - Farm/Co-op indicators */}
                    {/* ============================================ */}
                    <g opacity="0.6">
                        {/* Small farm icons */}
                        <text x="130" y="200" fontSize="20" fill="#5A7411" opacity="0.1">🌳</text>
                        <text x="150" y="400" fontSize="20" fill="#5A7411" opacity="0.1">🌳</text>
                        <text x="330" y="350" fontSize="20" fill="#5A7411" opacity="0.1">🌳</text>
                        <text x="550" y="150" fontSize="20" fill="#A0C800" opacity="0.1">🏘️</text>
                        <text x="600" y="480" fontSize="20" fill="#A0C800" opacity="0.1">🏘️</text>
                    </g>

                    {/* ============================================ */}
                    {/* LEGEND */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0, duration: 0.6 }}
                    >
                        {/* Legend box */}
                        <rect x="50" y="580" width="440" height="50" rx="12" fill="white" opacity="0.6" />
                        <rect x="50" y="580" width="440" height="50" rx="12" fill="none" stroke="#5A7411" strokeWidth="1" opacity="0.2" />

                        <circle cx="85" cy="605" r="8" fill="#5A7411" />
                        <text x="98" y="609" fontSize="9" fill="#5A7411" fontWeight="500">Farm</text>

                        <circle cx="170" cy="605" r="8" fill="#A0C800" />
                        <text x="183" y="609" fontSize="9" fill="#A0C800" fontWeight="500">Co-op</text>

                        <circle cx="255" cy="605" r="10" fill="#E04E00" />
                        <text x="270" y="609" fontSize="9" fill="#E04E00" fontWeight="500">NDC Hub</text>

                        <circle cx="365" cy="605" r="4" fill="#5A7411" />
                        <text x="374" y="609" fontSize="9" fill="#6b7280">Route</text>

                        <circle cx="440" cy="605" r="4" fill="#E04E00" />
                        <text x="449" y="609" fontSize="9" fill="#6b7280">Active</text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* STATUS BADGE - Top Right */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8, duration: 0.5 }}
                    >
                        <rect x="750" y="12" width="190" height="28" rx="14" fill="#5A7411" opacity="0.08" />
                        <rect x="750" y="12" width="190" height="28" rx="14" fill="white" stroke="#5A7411" strokeWidth="1" opacity="0.6" />
                        <text x="845" y="31" textAnchor="middle" fontSize="10" fill="#5A7411" fontWeight="600">Farm OS Network</text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* ANIMATION LABELS */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.6 }}
                    >
                        <text x="50" y="570" fontSize="8" fill="#6b7280" opacity="0.5">
                            {new Date().toLocaleDateString()} · Live Network Status
                        </text>
                        <text x="900" y="570" fontSize="8" fill="#6b7280" opacity="0.5" textAnchor="end">
                            {Math.floor(Math.random() * 100) + 50} active routes
                        </text>
                    </motion.g>

                </svg>
            </motion.div>
        </div>
    );
};

export default SupplyChainMapSVG;