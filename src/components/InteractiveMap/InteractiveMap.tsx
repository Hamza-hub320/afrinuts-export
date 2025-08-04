import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '../Typography/Typography';
import { FaMapMarkerAlt, FaTree, FaWater, FaRoad, FaWarehouse } from 'react-icons/fa';
import { Icon } from 'leaflet';
import Button from '../Button/Button';
import { useTranslation } from 'react-i18next';

// Custom icons
const farmIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const waterIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3163/3163471.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

const roadIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

const facilityIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

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
                                                           className = 'h-[500px] rounded-xl shadow-lg border border-warm-grey',
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

    // Coordinates for Odienné, Ivory Coast
    const position: [number, number] = [9.75090, -7.04220];

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
        <div className={`${className} bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 rounded-3xl shadow-xl overflow-hidden w-full max-w-none mx-auto`}>
            <div className="flex flex-col lg:flex-row h-full">
                {/* Map Section */}
                <div className="w-full lg:w-2/3 h-full relative">
                    <MapContainer
                        center={position}
                        zoom={zoom}
                        scrollWheelZoom={true}
                        className="h-full w-full"
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
                                pathOptions={{ color: '#5A7411', fillColor: '#5A7411', fillOpacity: 0.2 }} // Using your primary color
                            >
                                <Popup>
                                    <div className="text-text-dark">
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
                                    <Popup>
                                        <div className="text-text-dark">
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
                    <div className="absolute top-4 right-4 z-[1000] bg-background p-2 rounded-md shadow-md flex flex-col gap-2 backdrop-blur-sm">
                        <Button
                            size="sm"
                            variant={showBoundary ? 'primary' : 'outline'}
                            onClick={() => setShowBoundary(!showBoundary)}
                            className="whitespace-nowrap"
                        >
                            {showBoundary ? t('map.hideBoundary') : t('map.showBoundary')}
                        </Button>
                        <Button
                            size="sm"
                            variant={showFeatures ? 'primary' : 'outline'}
                            onClick={() => setShowFeatures(!showFeatures)}
                            className="whitespace-nowrap"
                        >
                            {showFeatures ? t('map.hideFeatures') : t('map.showFeatures')}
                        </Button>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="hidden lg:flex lg:w-1/3 flex-col bg-gradient-to-br from-primary/5 to-accent/5 p-6 overflow-y-auto">
                    <div className="flex items-center mb-4">
                        <FaMapMarkerAlt className="text-2xl text-accent mr-3" /> {/* Using accent color */}
                        <Typography variant="h3" className="text-primary"> {/* Using primary color */}
                            {t('map.farmLayout')}
                        </Typography>
                    </div>

                    <Typography variant="body" className="text-text-dark mb-4">
                        {description}
                    </Typography>

                    <div className="mb-6">
                        <Typography variant="small" className="text-text-dark">
                            <strong>{t('map.coordinates')}:</strong> 9.7509° N, 7.0422° W
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
                                <div
                                    key={feature.id}
                                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                                        activeFeature?.id === feature.id
                                            ? 'bg-primary/10 border border-primary'
                                            : 'bg-gradient-to-br from-primary/5 to-accent/5 hover:bg-warm-grey/20'
                                    }`}
                                    onClick={() => handleFeatureClick(feature)}
                                >
                                    <div className="flex items-center">
                                        <div className="mr-3">{getFeatureIcon(feature.type)}</div>
                                        <div>
                                            <Typography variant="body" className="font-medium text-text-dark">
                                                {feature.label}
                                            </Typography>
                                            <Typography variant="small" className="text-text-dark/80">
                                                {feature.description}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-auto pt-4 border-t border-warm-grey/50">
                        <Typography variant="h4" className="text-primary mb-2">
                            {t('map.legend')}
                        </Typography>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center">
                                <FaTree className="text-primary mr-2" />
                                <Typography variant="small">{t('map.legendCashew')}</Typography>
                            </div>
                            <div className="flex items-center">
                                <FaWater className="text-teal mr-2" />
                                <Typography variant="small">{t('map.legendWater')}</Typography>
                            </div>
                            <div className="flex items-center">
                                <FaRoad className="text-text-dark mr-2" />
                                <Typography variant="small">{t('map.legendRoads')}</Typography>
                            </div>
                            <div className="flex items-center">
                                <FaWarehouse className="text-accent mr-2" />
                                <Typography variant="small">{t('map.legendFacilities')}</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;

