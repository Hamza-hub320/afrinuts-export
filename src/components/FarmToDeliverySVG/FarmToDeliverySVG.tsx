import React from 'react';
import { motion } from 'framer-motion';
import {
    FaTree,
    FaTractor,
    FaIndustry,
    FaFlask,
    FaCertificate,
    FaShippingFast,
    FaBuilding,
    FaCheckCircle,
    FaQrcode,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { GiFarmer, GiCargoShip } from 'react-icons/gi';

const FarmToDeliveryRouteSVG: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-gradient-to-br from-primary/5 via-white/60 to-accent/5 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl p-6"
            >
                <svg viewBox="0 0 1000 320" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Gradients */}
                        <linearGradient id="routeGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5A7411" stopOpacity="0.6"/>
                            <stop offset="50%" stopColor="#E04E00" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#1A5A7A" stopOpacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#A0C800" stopOpacity="0.3"/>
                            <stop offset="50%" stopColor="#FF6B2B" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3A8AB5" stopOpacity="0.3"/>
                        </linearGradient>

                        {/* Node Gradients */}
                        <linearGradient id="nodeFarm" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5A7411" />
                            <stop offset="100%" stopColor="#8AA82A" />
                        </linearGradient>
                        <linearGradient id="nodeHarvest" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A0C800" />
                            <stop offset="100%" stopColor="#C4E844" />
                        </linearGradient>
                        <linearGradient id="nodeProcess" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E04E00" />
                            <stop offset="100%" stopColor="#FF6B2B" />
                        </linearGradient>
                        <linearGradient id="nodeQuality" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#253746" />
                            <stop offset="100%" stopColor="#4A6A7F" />
                        </linearGradient>
                        <linearGradient id="nodeCert" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2D6A4F" />
                            <stop offset="100%" stopColor="#409F73" />
                        </linearGradient>
                        <linearGradient id="nodeShip" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1A5A7A" />
                            <stop offset="100%" stopColor="#3A8AB5" />
                        </linearGradient>
                        <linearGradient id="nodeDeliver" x1="0%" y1="0%" x2="100%" y2="100%">
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

                    {/* Background decorative elements */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        transition={{ delay: 0.5 }}
                    >
                        <circle cx="60" cy="40" r="4" fill="#5A7411" />
                        <circle cx="180" cy="280" r="3" fill="#E04E00" />
                        <circle cx="320" cy="30" r="2" fill="#A0C800" />
                        <circle cx="480" cy="290" r="3" fill="#253746" />
                        <circle cx="620" cy="35" r="2" fill="#5A7411" />
                        <circle cx="780" cy="275" r="3" fill="#E04E00" />
                        <circle cx="920" cy="45" r="2" fill="#A0C800" />
                    </motion.g>

                    {/* ============================================ */}
                    {/* CURVY ROUTE PATH - Main S-curve */}
                    {/* ============================================ */}
                    <motion.path
                        d="M60,160 C180,60 280,220 380,160 C480,100 580,240 680,160 C780,100 880,220 940,160"
                        fill="none"
                        stroke="url(#routeGrad1)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ delay: 0.8, duration: 2.5, ease: "easeInOut" }}
                    />

                    {/* Secondary glow path */}
                    <motion.path
                        d="M60,160 C180,60 280,220 380,160 C480,100 580,240 680,160 C780,100 880,220 940,160"
                        fill="none"
                        stroke="url(#routeGrad2)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ delay: 0.8, duration: 2.5, ease: "easeInOut" }}
                    />

                    {/* Animated traveling dots along the route */}
                    <motion.circle
                        r="6"
                        fill="#5A7411"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: 'linear', delay: 0.5 }}
                        style={{ offsetPath: 'path("M60,160 C180,60 280,220 380,160 C480,100 580,240 680,160 C780,100 880,220 940,160")' }}
                    />
                    <motion.circle
                        r="4"
                        fill="#E04E00"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'linear', delay: 0.8 }}
                        style={{ offsetPath: 'path("M60,160 C180,60 280,220 380,160 C480,100 580,240 680,160 C780,100 880,220 940,160")' }}
                    />
                    <motion.circle
                        r="3"
                        fill="#A0C800"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: 1.1 }}
                        style={{ offsetPath: 'path("M60,160 C180,60 280,220 380,160 C480,100 580,240 680,160 C780,100 880,220 940,160")' }}
                    />

                    {/* Route markers - small dots along the path */}
                    {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((pos, i) => {
                        // Calculate approximate positions along the curve
                        const x = 60 + pos * 880;
                        const y = 160 + Math.sin(pos * Math.PI * 3) * 80;
                        return (
                            <motion.circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="2"
                                fill="#5A7411"
                                opacity="0.3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                transition={{ delay: 1.0 + i * 0.1 }}
                            />
                        );
                    })}

                    {/* ============================================ */}
                    {/* NODE 1: FARM - Start of route */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        {/* Route marker line */}
                        <line x1="60" y1="190" x2="60" y2="210" stroke="#5A7411" strokeWidth="2" strokeDasharray="4,3" opacity="0.5" />

                        <circle cx="60" cy="160" r="40" fill="#5A7411" opacity="0.06" />
                        <circle cx="60" cy="160" r="32" fill="url(#nodeFarm)" opacity="0.1" />
                        <circle cx="60" cy="160" r="28" fill="white" stroke="url(#nodeFarm)" strokeWidth="3" />

                        <foreignObject x="44" y="144" width="32" height="32">
                            <div className="flex items-center justify-center w-full h-full text-primary">
                                <FaTree className="text-lg" />
                            </div>
                        </foreignObject>

                        <text x="60" y="200" textAnchor="middle" fontSize="12" fill="#5A7411" fontWeight="700" letterSpacing="0.5">
                            FARM
                        </text>
                        <text x="60" y="214" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="400">
                            Origin
                        </text>

                        <motion.circle
                            cx="60" cy="160" r="28"
                            fill="none" stroke="#5A7411" strokeWidth="2"
                            initial={{ opacity: 0.8, r: 28 }}
                            animate={{ opacity: 0, r: 50 }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 2: HARVEST */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="180" cy="100" r="36" fill="#A0C800" opacity="0.06" />
                        <circle cx="180" cy="100" r="28" fill="url(#nodeHarvest)" opacity="0.1" />
                        <circle cx="180" cy="100" r="24" fill="white" stroke="url(#nodeHarvest)" strokeWidth="2.5" />

                        <foreignObject x="166" y="86" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#A0C800' }}>
                                <GiFarmer className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="180" y="138" textAnchor="middle" fontSize="11" fill="#A0C800" fontWeight="700" letterSpacing="0.3">
                            HARVEST
                        </text>
                        <text x="180" y="152" textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="400">
                            Collection
                        </text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 3: PROCESSING */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="300" cy="200" r="40" fill="#E04E00" opacity="0.06" />
                        <circle cx="300" cy="200" r="32" fill="url(#nodeProcess)" opacity="0.1" />
                        <circle cx="300" cy="200" r="28" fill="white" stroke="url(#nodeProcess)" strokeWidth="3" />

                        <foreignObject x="284" y="184" width="32" height="32">
                            <div className="flex items-center justify-center w-full h-full text-accent">
                                <FaIndustry className="text-lg" />
                            </div>
                        </foreignObject>

                        <text x="300" y="240" textAnchor="middle" fontSize="12" fill="#E04E00" fontWeight="700" letterSpacing="0.5">
                            NUTS DISTRIBUTION CENTER
                        </text>
                        <text x="300" y="254" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="400">
                            Value Addition
                        </text>

                        <motion.circle
                            cx="300" cy="200" r="28"
                            fill="none" stroke="#E04E00" strokeWidth="2"
                            initial={{ opacity: 0.8, r: 28 }}
                            animate={{ opacity: 0, r: 52 }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeOut', delay: 0.5 }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 4: QUALITY */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="440" cy="120" r="36" fill="#253746" opacity="0.06" />
                        <circle cx="440" cy="120" r="28" fill="url(#nodeQuality)" opacity="0.1" />
                        <circle cx="440" cy="120" r="24" fill="white" stroke="url(#nodeQuality)" strokeWidth="2.5" />

                        <foreignObject x="426" y="106" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#253746' }}>
                                <FaFlask className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="440" y="158" textAnchor="middle" fontSize="11" fill="#253746" fontWeight="700" letterSpacing="0.3">
                            QUALITY
                        </text>
                        <text x="440" y="172" textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="400">
                            Assurance
                        </text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 5: CERTIFICATION */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.3, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="580" cy="190" r="36" fill="#2D6A4F" opacity="0.06" />
                        <circle cx="580" cy="190" r="28" fill="url(#nodeCert)" opacity="0.1" />
                        <circle cx="580" cy="190" r="24" fill="white" stroke="url(#nodeCert)" strokeWidth="2.5" />

                        <foreignObject x="566" y="176" width="28" height="28">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#2D6A4F' }}>
                                <FaCertificate className="text-base" />
                            </div>
                        </foreignObject>

                        <text x="580" y="228" textAnchor="middle" fontSize="11" fill="#2D6A4F" fontWeight="700" letterSpacing="0.3">
                            CERTIFICATION
                        </text>
                        <text x="580" y="242" textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="400">
                            Verified
                        </text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 6: SHIPPING */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="720" cy="110" r="40" fill="#1A5A7A" opacity="0.06" />
                        <circle cx="720" cy="110" r="32" fill="url(#nodeShip)" opacity="0.1" />
                        <circle cx="720" cy="110" r="28" fill="white" stroke="url(#nodeShip)" strokeWidth="3" />

                        <foreignObject x="704" y="94" width="32" height="32">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#1A5A7A' }}>
                                <GiCargoShip className="text-lg" />
                            </div>
                        </foreignObject>

                        <text x="720" y="152" textAnchor="middle" fontSize="12" fill="#1A5A7A" fontWeight="700" letterSpacing="0.5">
                            SHIPPING
                        </text>
                        <text x="720" y="166" textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="400">
                            Global Logistics
                        </text>

                        <motion.circle
                            cx="720" cy="110" r="28"
                            fill="none" stroke="#1A5A7A" strokeWidth="2"
                            initial={{ opacity: 0.8, r: 28 }}
                            animate={{ opacity: 0, r: 52 }}
                            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeOut', delay: 0.3 }}
                        />
                    </motion.g>

                    {/* ============================================ */}
                    {/* NODE 7: DELIVERY - End of route */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.7, type: 'spring', stiffness: 300, damping: 15 }}
                        filter="url(#shadow)"
                    >
                        <circle cx="920" cy="200" r="38" fill="#C77D00" opacity="0.06" />
                        <circle cx="920" cy="200" r="30" fill="url(#nodeDeliver)" opacity="0.1" />
                        <circle cx="920" cy="200" r="26" fill="white" stroke="url(#nodeDeliver)" strokeWidth="3" />

                        <foreignObject x="904" y="184" width="32" height="32">
                            <div className="flex items-center justify-center w-full h-full" style={{ color: '#C77D00' }}>
                                <FaBuilding className="text-lg" />
                            </div>
                        </foreignObject>

                        {/* Checkmark badge */}
                        <circle cx="944" cy="184" r="12" fill="#22c55e" stroke="white" strokeWidth="2" />
                        <foreignObject x="939" y="179" width="10" height="10">
                            <div className="flex items-center justify-center w-full h-full text-white">
                                <FaCheckCircle className="text-xs" />
                            </div>
                        </foreignObject>

                        <text x="920" y="240" textAnchor="middle" fontSize="12" fill="#C77D00" fontWeight="700" letterSpacing="0.5">
                            DELIVERY
                        </text>
                        <text x="920" y="254" textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="600">
                            ✓ Completed
                        </text>

                        {/* End marker */}
                        <line x1="920" y1="160" x2="920" y2="180" stroke="#C77D00" strokeWidth="2" strokeDasharray="4,3" opacity="0.5" />
                    </motion.g>

                    {/* ============================================ */}
                    {/* TOP LABEL */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                    >
                        <text x="500" y="28" textAnchor="middle" fontSize="16" fill="#5A7411" fontWeight="700" letterSpacing="2">
                            FROM FARM TO DELIVERY
                        </text>
                        <text x="500" y="48" textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="400" letterSpacing="0.5">
                            Every step of your cashew journey — tracked, verified, and delivered with confidence
                        </text>

                        {/* Decorative line under title */}
                        <line x1="300" y1="55" x2="700" y2="55" stroke="#5A7411" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                    </motion.g>

                    {/* ============================================ */}
                    {/* START / END MARKERS */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0 }}
                    >
                        <text x="50" y="280" textAnchor="middle" fontSize="8" fill="#5A7411" fontWeight="500" letterSpacing="0.5">
                            START
                        </text>
                        <text x="930" y="280" textAnchor="middle" fontSize="8" fill="#C77D00" fontWeight="500" letterSpacing="0.5">
                            END
                        </text>
                    </motion.g>

                    {/* ============================================ */}
                    {/* FARM OS VERIFICATION BADGE - TOP RIGHT */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.0, duration: 0.5 }}
                    >
                        <rect x="785" y="12" width="190" height="30" rx="15" fill="#5A7411" opacity="0.08" />
                        <rect x="785" y="12" width="190" height="30" rx="15" fill="white" stroke="#5A7411" strokeWidth="1" opacity="0.6" />

                        {/* QR Code Icon - Left aligned */}
                        <foreignObject x="793" y="17" width="20" height="20">
                            <div className="flex items-center justify-center w-full h-full text-primary">
                                <FaQrcode className="text-sm" />
                            </div>
                        </foreignObject>

                        {/* Text - Centered */}
                        <text x="885" y="31" textAnchor="middle" fontSize="10" fill="#5A7411" fontWeight="600">
                            Farm OS Verified
                        </text>

                        {/* Checkmark - Right aligned */}
                        <foreignObject x="960" y="17" width="12" height="20">
                            <div className="flex items-center justify-center w-full h-full text-green-500">
                                <FaCheckCircle className="text-[10px]" />
                            </div>
                        </foreignObject>
                    </motion.g>

                    {/* ============================================ */}
                    {/* LEGEND */}
                    {/* ============================================ */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.4, duration: 0.6 }}
                    >
                        <rect x="80" y="290" width="8" height="8" rx="2" fill="#5A7411" />
                        <text x="92" y="297" fontSize="8" fill="#6b7280">Farm</text>

                        <rect x="150" y="290" width="8" height="8" rx="2" fill="#A0C800" />
                        <text x="162" y="297" fontSize="8" fill="#6b7280">Harvest</text>

                        <rect x="240" y="290" width="8" height="8" rx="2" fill="#E04E00" />
                        <text x="252" y="297" fontSize="8" fill="#6b7280">Process</text>

                        <rect x="330" y="290" width="8" height="8" rx="2" fill="#253746" />
                        <text x="342" y="297" fontSize="8" fill="#6b7280">Quality</text>

                        <rect x="420" y="290" width="8" height="8" rx="2" fill="#2D6A4F" />
                        <text x="432" y="297" fontSize="8" fill="#6b7280">Certify</text>

                        <rect x="510" y="290" width="8" height="8" rx="2" fill="#1A5A7A" />
                        <text x="522" y="297" fontSize="8" fill="#6b7280">Ship</text>

                        <rect x="590" y="290" width="8" height="8" rx="2" fill="#C77D00" />
                        <text x="602" y="297" fontSize="8" fill="#6b7280">Deliver</text>
                    </motion.g>

                </svg>
            </motion.div>
        </div>
    );
};

export default FarmToDeliveryRouteSVG;