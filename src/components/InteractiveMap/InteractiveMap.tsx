import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '../Typography/Typography';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
    location: string;
    description: string;
    zoom?: number;
    className?: string;
}

const MapViewSetter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
                                                           location,
                                                           description,
                                                           zoom = 12,
                                                           className = 'h-96 rounded-xl shadow-lg border border-afri-light'
                                                       }) => {
    // Coordinates for Odienné, Ivory Coast
    const position: [number, number] = [9.5050, -7.5649];

    return (
        <div className={`${className} overflow-hidden`}>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3">
                    <MapContainer
                        center={position}
                        zoom={zoom}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                    >
                        <MapViewSetter center={position} zoom={zoom} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                <div className="text-afri-dark">
                                    <FaMapMarkerAlt className="inline-block text-afri-secondary mr-2" />
                                    <strong>AfriNuts Export Farm</strong>
                                    <div className="text-sm mt-1">{location}</div>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                <div className="w-full md:w-1/3 bg-afri-light p-6 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                        <FaMapMarkerAlt className="text-2xl text-afri-secondary mr-3" />
                        <Typography variant="h3" className="text-afri-primary">
                            Our Location
                        </Typography>
                    </div>
                    <Typography variant="body" className="text-afri-dark mb-4">
                        {description}
                    </Typography>
                    <div className="mt-4">
                        <Typography variant="small" className="text-afri-dark">
                            <strong>Coordinates:</strong> 9.5050° N, 7.5649° W
                        </Typography>
                        <Typography variant="small" className="text-afri-dark">
                            <strong>Region:</strong> Denguélé District, Ivory Coast
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;