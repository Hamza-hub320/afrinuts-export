import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
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
                <Marker position={[latitude, longitude]}>
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