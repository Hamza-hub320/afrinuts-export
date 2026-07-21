import React from 'react';
import { motion } from 'framer-motion';
import {
    FaTree,
    FaUserFriends,
    FaHandshake,
    FaIndustry,
    FaFlask,
    FaGlobeEurope,
    FaGlobeAfrica,
} from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

const SupplyChainNetwork: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 -mt-8 mb-4 relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-gradient-to-br from-primary/5 via-white/60 to-accent/5 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl p-6"
            >
                <svg viewBox="0 0 900 200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Gradients for nodes */}
                        <linearGradient id="farmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5A7411" />
                            <stop offset="100%" stopColor="#8AA82A" />
                        </linearGradient>
                        <linearGradient id="supplierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A0C800" />
                            <stop offset="100%" stopColor="#C4E844" />
                        </linearGradient>
                        <linearGradient id="processingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E04E00" />
                            <stop offset="100%" stopColor="#FF6B2B" />
                        </linearGradient>
                        <linearGradient id="qualityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#253746" />
                            <stop offset="100%" stopColor="#4A6A7F" />
                        </linearGradient>
                        <linearGradient id="exportGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2D6A4F" />
                            <stop offset="100%" stopColor="#409F73" />
                        </linearGradient>
                        <linearGradient id="exportGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C77D00" />
                            <stop offset="100%" stopColor="#F5A623" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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

                    {/* Background pattern */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        transition={{ delay: 0.5 }}
                    >
                        <circle cx="100" cy="50" r="4" fill="#5A7411" />
                        <circle cx="200" cy="150" r="3" fill="#E04E00" />
                        <circle cx="350" cy="30" r="2" fill="#A0C800" />
                        <circle cx="500" cy="160" r="3" fill="#253746" />
                        <circle cx="650" cy="40" r="2" fill="#5A7411" />
                        <circle cx="800" cy="140" r="3" fill="#E04E00" />
                    </motion.g>

                    {/* Animated flow lines - Main path */}
                    <motion.path
                        d="M150,100 C280,40 400,160 500,100 C600,60 700,140 800,100"
                        fill="none"
                        stroke="#5A7411"
                        strokeWidth="2"
                        strokeDasharray="8,6"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ delay: 0.8, duration: 2.5 }}
                    />

                    {/* Secondary flow path */}
                    <motion.path
                        d="M150,100 C280,160 400,40 500,100 C600,140 700,60 800,100"
                        fill="none"
                        stroke="#E04E00"
                        strokeWidth="2"
                        strokeDasharray="8,6"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ delay: 1, duration: 2.5 }}
                    />

                    {/* Animated particles along the path */}
                    <motion.circle
                        r="4"
                        fill="#5A7411"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: 0.5 }}
                        style={{ offsetPath: 'path("M150,100 C280,40 400,160 500,100 C600,60 700,140 800,100")' }}
                    />
                    <motion.circle
                        r="3"
                        fill="#E04E00"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', delay: 0.8 }}
                        style={{ offsetPath: 'path("M150,100 C280,160 400,40 500,100 C600,140 700,60 800,100")' }}
                    />
                    <motion.circle
                        r="2.5"
                        fill="#A0C800"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear', delay: 1.1 }}
                        style={{ offsetPath: 'path("M150,100 C280,100 400,100 500,100 C600,100 700,100 800,100")' }}
                    />

                    {/* ============================================ */}
                    {/* FARM NODE - Origin */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="130" cy="100" r="38" fill="#5A7411" opacity="0.08" />
                        <circle cx="130" cy="100" r="30" fill="url(#farmGrad)" opacity="0.1" />
                        <circle cx="130" cy="100" r="26" fill="white" stroke="url(#farmGrad)" strokeWidth="2.5" />

                        {/* ✅ Fixed: Icon using React component with proper positioning */}
                        <foreignObject x="115" y="85" width="30" height="30">
                            <div className="flex items-center justify-center w-full h-full text-primary">
                                <FaTree className="text-lg" />
                            </div>
                        </foreignObject>

                        <text x="130" y="136" textAnchor="middle" fontSize="12" fill="#5A7411" fontWeight="700" letterSpacing="0.5">
                            FARM
                        </text>
                        <text x="130" y="150" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="400">
                            Origin
                        </text>

                        <motion.circle
                            cx="130" cy="100" r="26"
                            fill="none" stroke="#5A7411" strokeWidth="1.5"
                            initial={{ opacity: 0.8, r: 26 }}
                            animate={{ opacity: 0, r: 48 }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* SUPPLIER NODES */}
                    {/* ============================================ */}
                    {[
                        { cx: 280, cy: 65, label: 'FARMERS', sub: 'Partners', icon: FaUserFriends, color: '#A0C800' },
                        { cx: 280, cy: 135, label: 'CO-OPS', sub: 'Collectives', icon: FaHandshake, color: '#A0C800' },
                    ].map((node, i) => (
                        <motion.g
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.7 + i * 0.15, type: 'spring', stiffness: 300, damping: 15 }}
                            filter="url(#shadow)"
                        >
                            <circle cx={node.cx} cy={node.cy} r="30" fill={node.color} opacity="0.06" />
                            <circle cx={node.cx} cy={node.cy} r="22" fill="white" stroke={node.color} strokeWidth="2" />

                            <foreignObject x={node.cx - 12} y={node.cy - 12} width="24" height="24">
                                <div className="flex items-center justify-center w-full h-full" style={{ color: node.color }}>
                                    <node.icon className="text-sm" />
                                </div>
                            </foreignObject>

                            <text x={node.cx} y={node.cy + 32} textAnchor="middle" fontSize="10" fill={node.color} fontWeight="700" letterSpacing="0.3">
                                {node.label}
                            </text>
                            <text x={node.cx} y={node.cy + 44} textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="400">
                                {node.sub}
                            </text>
                        </motion.g>
                    ))}

                    {/* Connection dots */}
                    <motion.circle
                        cx="340" cy="80" r="3" fill="#A0C800"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    />
                    <motion.circle
                        cx="345" cy="110" r="2.5" fill="#A0C800"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                    />

                    {/* ============================================ */}
                    {/* PROCESSING NODE - ✅ FIXED */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.0, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="480" cy="100" r="42" fill="#E04E00" opacity="0.08" />
                        <circle cx="480" cy="100" r="34" fill="url(#processingGrad)" opacity="0.1" />
                        <circle cx="480" cy="100" r="28" fill="white" stroke="url(#processingGrad)" strokeWidth="2.5" />

                        <foreignObject x="465" y="85" width="30" height="30">
                            <div className="flex items-center justify-center w-full h-full text-accent">
                                <FaIndustry className="text-lg" />
                            </div>
                        </foreignObject>

                        <text x="480" y="138" textAnchor="middle" fontSize="12" fill="#E04E00" fontWeight="700" letterSpacing="0.5">
                            PROCESSING
                        </text>
                        <text x="480" y="152" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="400">
                            Value Addition
                        </text>

                        <motion.circle
                            cx="480" cy="100" r="28"
                            fill="none" stroke="#E04E00" strokeWidth="1.5"
                            initial={{ opacity: 0.8, r: 28 }}
                            animate={{ opacity: 0, r: 52 }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeOut', delay: 0.5 }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* QUALITY NODE - ✅ FIXED */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="620" cy="100" r="36" fill="#253746" opacity="0.06" />
                        <circle cx="620" cy="100" r="28" fill="white" stroke="url(#qualityGrad)" strokeWidth="2" />

                        <foreignObject x="608" y="88" width="24" height="24">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#253746' }}>
                                <HiOutlineSparkles className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="620" y="136" textAnchor="middle" fontSize="10" fill="#253746" fontWeight="700" letterSpacing="0.3">
                            QUALITY
                        </text>
                        <text x="620" y="148" textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="400">
                            Assurance
                        </text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* EXPORT NODES */}
                    {/* ============================================ */}
                    {[
                        { cx: 750, cy: 70, label: 'EUROPE', sub: 'EU Market', icon: FaGlobeEurope, color: '#2D6A4F', delay: 1.4 },
                        { cx: 750, cy: 130, label: 'MIDDLE EAST', sub: 'GCC & MENA', icon: FaGlobeAfrica, color: '#C77D00', delay: 1.5 },
                    ].map((node, i) => (
                        <motion.g
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: node.delay, type: 'spring', stiffness: 300, damping: 15 }}
                            filter="url(#shadow)"
                        >
                            <circle cx={node.cx} cy={node.cy} r="30" fill={node.color} opacity="0.06" />
                            <circle cx={node.cx} cy={node.cy} r="22" fill="white" stroke={node.color} strokeWidth="2" />

                            <foreignObject x={node.cx - 12} y={node.cy - 12} width="24" height="24">
                                <div className="flex items-center justify-center w-full h-full" style={{ color: node.color }}>
                                    <node.icon className="text-sm" />
                                </div>
                            </foreignObject>

                            <text x={node.cx} y={node.cy + 32} textAnchor="middle" fontSize="10" fill={node.color} fontWeight="700" letterSpacing="0.3">
                                {node.label}
                            </text>
                            <text x={node.cx} y={node.cy + 44} textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="400">
                                {node.sub}
                            </text>
                        </motion.g>
                    ))}

                    {/* ============================================ */}
                    {/* TOP LABEL */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                    >
                        <line x1="150" y1="18" x2="350" y2="18" stroke="#5A7411" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                        <line x1="550" y1="18" x2="750" y2="18" stroke="#E04E00" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />

                        <text x="450" y="22" textAnchor="middle" fontSize="13" fill="#5A7411" fontWeight="700" letterSpacing="1.5">
                            FARM-TO-MARKET SUPPLY CHAIN
                        </text>
                        <text x="450" y="38" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="400" letterSpacing="0.5">
                            Traceable · Sustainable · Tech-Enabled
                        </text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* LEGEND */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                    >
                        <rect x="240" y="180" width="8" height="8" rx="2" fill="#5A7411" />
                        <text x="252" y="187" fontSize="8" fill="#6b7280">Farm Origin</text>

                        <rect x="340" y="180" width="8" height="8" rx="2" fill="#A0C800" />
                        <text x="352" y="187" fontSize="8" fill="#6b7280">Suppliers</text>

                        <rect x="440" y="180" width="8" height="8" rx="2" fill="#E04E00" />
                        <text x="452" y="187" fontSize="8" fill="#6b7280">Processing</text>

                        <rect x="560" y="180" width="8" height="8" rx="2" fill="#253746" />
                        <text x="572" y="187" fontSize="8" fill="#6b7280">Quality</text>

                        <rect x="660" y="180" width="8" height="8" rx="2" fill="#2D6A4F" />
                        <text x="672" y="187" fontSize="8" fill="#6b7280">Export</text>
                    </motion.g>
                </svg>
            </motion.div>
        </div>
    );
};

export default SupplyChainNetwork;