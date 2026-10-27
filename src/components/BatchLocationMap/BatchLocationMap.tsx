import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLock, FaMapMarkerAlt } from 'react-icons/fa';

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
    // When true, render a placeholder instead of the map.
    // Should be set by the caller when farmer.locationWithheld === true.
    locationWithheld?: boolean;
}

const BatchLocationMap: React.FC<BatchLocationMapProps> = ({
                                                               latitude,
                                                               longitude,
                                                               farmName = 'AfriNuts Farm',
                                                               block,
                                                               className = '',
                                                               locationWithheld = false,
                                                           }) => {
    // ── Withheld: render a placeholder card, never the real map ──
    if (locationWithheld) {
        return (
            <div className={`rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 bg-gray-50 ${className}`}>
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                        <FaLock className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                        Precise location withheld
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                        This farmer has consented to share the region but not the exact GPS coordinates of the farm.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-200">
                        <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
                        <span className="text-xs text-gray-600">Côte d'Ivoire · Odienné</span>
                    </div>
                </div>
            </div>
        );
    }

    // ── Consent given: render the map as before ──
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