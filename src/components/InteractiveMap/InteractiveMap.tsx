import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '../Typography/Typography';
import { FaMapMarkerAlt, FaTree, FaWater, FaRoad, FaWarehouse } from 'react-icons/fa';
import Button from '../Button/Button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { renderToStaticMarkup } from 'react-dom/server';


const createMarkerIcon = (Icon: React.ComponentType<{ color?: string }>, color: string, bgColor: string = 'white') => {
    return L.divIcon({
        className: '',
        html: `<div style="
            background:${bgColor};
            width:36px;height:36px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            border:3px solid ${color};
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            font-size:16px;
        ">${renderToStaticMarkup(<Icon color={color} />)}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
};

const farmIcon = createMarkerIcon(FaTree, '#5A7411');
const waterIcon = createMarkerIcon(FaWater, '#00869D');
const roadIcon = createMarkerIcon(FaRoad, '#5A4D47');
const facilityIcon = createMarkerIcon(FaWarehouse, '#E04E00');

interface FarmFeature {
    id: string;
    type: 'tree' | 'water' | 'road' | 'facility';
    position: [number, number];
    label: string;
    description: string;
}

interface InteractiveMapProps {
    location: string;
    description: string;
    zoom?: number;
    className?: string;
    farmBoundary?: [number, number][];
    features?: FarmFeature[];
    zoomControl?: boolean;
}

const MapViewSetter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
                                                           location,
                                                           description,
                                                           zoom = 14,
                                                           className = 'h-[500px] rounded-3xl shadow-xl border-2 border-primary/20',
                                                           farmBoundary = [
                                                               [9.505, -7.565],
                                                               [9.505, -7.555],
                                                               [9.495, -7.555],
                                                               [9.495, -7.565],
                                                               [9.505, -7.565]
                                                           ],
                                                           features = [
                                                               {
                                                                   id: 'main-farm',
                                                                   type: 'tree',
                                                                   position: [9.5, -7.56] as [number, number],
                                                                   label: 'Main Cashew Plantation',
                                                                   description: '35 hectares of premium cashew trees'
                                                               },
                                                               {
                                                                   id: 'water-source',
                                                                   type: 'water',
                                                                   position: [9.502, -7.558] as [number, number],
                                                                   label: 'Water Reservoir',
                                                                   description: 'Sustainable irrigation water source'
                                                               },
                                                               {
                                                                   id: 'access-road',
                                                                   type: 'road',
                                                                   position: [9.498, -7.562] as [number, number],
                                                                   label: 'Main Access Road',
                                                                   description: 'Connects farm to processing center'
                                                               },
                                                               {
                                                                   id: 'storage-facility',
                                                                   type: 'facility',
                                                                   position: [9.503, -7.563] as [number, number],
                                                                   label: 'Storage Facility',
                                                                   description: 'Temporary storage for raw cashews'
                                                               }
                                                           ]
                                                       }) => {
    const [activeFeature, setActiveFeature] = useState<FarmFeature | null>(null);
    const [showBoundary, setShowBoundary] = useState(true);
    const [showFeatures, setShowFeatures] = useState(true);
    const mapRef = useRef<L.Map>(null);
    const { t } = useTranslation('farm');

    // Coordinates for Odienné, Ivory Coast (official OpenStreetMap coordinates)
    const position: [number, number] = [9.5044310, -7.5619420];

    const getIcon = (type: FarmFeature['type']) => {
        switch (type) {
            case 'tree':
                return farmIcon;
            case 'water':
                return waterIcon;
            case 'road':
                return roadIcon;
            case 'facility':
                return facilityIcon;
            default:
                return farmIcon;
        }
    };

    const getFeatureIcon = (type: FarmFeature['type']) => {
        switch (type) {
            case 'tree':
                return <FaTree className="text-primary" />;
            case 'water':
                return <FaWater className="text-teal" />;
            case 'road':
                return <FaRoad className="text-text-dark" />;
            case 'facility':
                return <FaWarehouse className="text-accent" />;
            default:
                return <FaTree className="text-primary" />;
        }
    };

    const handleFeatureClick = (feature: FarmFeature) => {
        setActiveFeature(feature);
        if (mapRef.current) {
            mapRef.current.flyTo(feature.position, 16);
        }
    };

    return (
        <motion.div
            className={`${className} bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-3xl shadow-xl overflow-hidden max-w-full lg:max-w-[1400px] mx-auto transform-gpu`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-8px] hover:translate-z-[-12px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            <div className="relative z-10 flex flex-col lg:flex-row h-full">
                {/* Map Section */}
                <div className="w-full lg:w-2/3 h-full relative">
                    <MapContainer
                        center={position}
                        zoom={zoom}
                        scrollWheelZoom={true}
                        className="h-full w-full rounded-l-3xl"
                        ref={mapRef}
                    >
                        <MapViewSetter center={position} zoom={zoom} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Farm Boundary */}
                        {showBoundary && (
                            <Polygon
                                positions={farmBoundary}
                                pathOptions={{
                                    color: '#5A7411',
                                    fillColor: '#5A7411',
                                    fillOpacity: 0.2,
                                    weight: 3
                                }}
                            >
                                <Popup className="rounded-xl shadow-lg">
                                    <div className="text-text-dark p-2">
                                        <strong>AfriNuts Export Farm Boundary</strong>
                                        <div className="text-sm mt-1">50 hectares of sustainable cashew farming</div>
                                    </div>
                                </Popup>
                            </Polygon>
                        )}

                        {/* Farm Features */}
                        {showFeatures &&
                            features.map((feature) => (
                                <Marker key={feature.id} position={feature.position} icon={getIcon(feature.type)}>
                                    <Popup className="rounded-xl shadow-lg">
                                        <div className="text-text-dark p-2">
                                            <div className="flex items-center">
                                                {getFeatureIcon(feature.type)}
                                                <strong className="ml-2">{feature.label}</strong>
                                            </div>
                                            <div className="text-sm mt-1">{feature.description}</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                    </MapContainer>

                    {/* Map Controls */}
                    <motion.div
                        className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg flex flex-col gap-2 border border-white/30"
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            size="sm"
                            variant={showBoundary ? 'primary' : 'outline'}
                            onClick={() => setShowBoundary(!showBoundary)}
                            className="whitespace-nowrap transform-gpu hover:scale-105 transition-transform"
                        >
                            {showBoundary ? t('map.hideBoundary') : t('map.showBoundary')}
                        </Button>
                        <Button
                            size="sm"
                            variant={showFeatures ? 'primary' : 'outline'}
                            onClick={() => setShowFeatures(!showFeatures)}
                            className="whitespace-nowrap transform-gpu hover:scale-105 transition-transform"
                        >
                            {showFeatures ? t('map.hideFeatures') : t('map.showFeatures')}
                        </Button>
                    </motion.div>
                </div>

                {/* Info Panel */}
                <div className="hidden lg:flex lg:w-1/3 flex-col bg-gradient-to-br from-primary/5 to-accent/5 p-6 overflow-y-auto relative z-10">
                    {/* Glassy overlay for info panel */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-r-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center mb-4">
                            <motion.div
                                className="bg-white/40 backdrop-blur-md p-3 rounded-full mr-3 shadow-md"
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <FaMapMarkerAlt className="text-2xl text-accent" />
                            </motion.div>
                            <Typography variant="h3" className="text-primary">
                                {t('map.farmLayout')}
                            </Typography>
                        </div>

                        <Typography variant="body" className="text-text-dark mb-4">
                            {description}
                        </Typography>

                        <div className="mb-6 bg-white/30 backdrop-blur-sm p-4 rounded-xl">
                            <Typography variant="small" className="text-text-dark">
                                <strong>{t('map.coordinates')}:</strong> 9.5044° N, 7.5619° W
                            </Typography>
                            <Typography variant="small" className="text-text-dark">
                                <strong>{t('map.region')}:</strong> Denguélé District, Ivory Coast
                            </Typography>
                            <Typography variant="small" className="text-text-dark">
                                <strong>{t('map.area')}:</strong> 50 hectares
                            </Typography>
                        </div>

                        {/* Farm Features List */}
                        <div className="mb-4">
                            <Typography variant="h4" className="text-primary mb-2">
                                {t('map.farmFeatures')}
                            </Typography>
                            <div className="space-y-2">
                                {features.map((feature) => (
                                    <motion.div
                                        key={feature.id}
                                        className={`p-3 rounded-xl cursor-pointer transition-all duration-300 transform-gpu hover:scale-102 ${
                                            activeFeature?.id === feature.id
                                                ? 'bg-primary/20 border-2 border-primary backdrop-blur-sm'
                                                : 'bg-white/30 backdrop-blur-sm hover:bg-white/40 border border-white/20'
                                        }`}
                                        onClick={() => handleFeatureClick(feature)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center">
                                            <div className="mr-3 bg-white/50 p-2 rounded-full">
                                                {getFeatureIcon(feature.type)}
                                            </div>
                                            <div>
                                                <Typography variant="body" className="font-medium text-text-dark">
                                                    {feature.label}
                                                </Typography>
                                                <Typography variant="small" className="text-text-dark/80">
                                                    {feature.description}
                                                </Typography>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-auto pt-4 border-t border-warm-grey/50">
                            <Typography variant="h4" className="text-primary mb-2">
                                {t('map.legend')}
                            </Typography>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { icon: <FaTree className="text-primary mr-2" />, text: t('map.legendCashew') },
                                    { icon: <FaWater className="text-teal mr-2" />, text: t('map.legendWater') },
                                    { icon: <FaRoad className="text-text-dark mr-2" />, text: t('map.legendRoads') },
                                    { icon: <FaWarehouse className="text-accent mr-2" />, text: t('map.legendFacilities') }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center bg-white/30 backdrop-blur-sm p-2 rounded-lg"
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.icon}
                                        <Typography variant="small">{item.text}</Typography>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InteractiveMap;