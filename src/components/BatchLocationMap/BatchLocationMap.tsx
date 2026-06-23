import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface BatchLocationMapProps {
    latitude: number;
    longitude: number;
    farmName?: string;
    block?: string;
    className?: string;
}

const BatchLocationMap: React.FC<BatchLocationMapProps> = ({
                                                               latitude,
                                                               longitude,
                                                               farmName = 'AfriNuts Farm',
                                                               block,
                                                               className = '',
                                                           }) => {
    return (
        <div className={`rounded-xl overflow-hidden shadow-lg border-2 border-white/30 ${className}`}>
            <MapContainer
                center={[latitude, longitude]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '280px', width: '100%' }}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[latitude, longitude]}
                    icon={DefaultIcon}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong>{farmName}</strong>
                            {block && <div>Block: {block}</div>}
                            <div className="text-xs text-gray-500">
                                {latitude.toFixed(4)}, {longitude.toFixed(4)}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default BatchLocationMap;