import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SupplierLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    type: string;
    location: string;
}

interface SupplierMapProps {
    suppliers: SupplierLocation[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}

const SupplierMap: React.FC<SupplierMapProps> = ({
                                                     suppliers,
                                                     center = [9.51, -7.5692], // Odienné, Ivory Coast
                                                     zoom = 10,
                                                     className = ''
                                                 }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView(center, zoom);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const validSuppliers = suppliers.filter(s => s.latitude && s.longitude && s.latitude !== 0 && s.longitude !== 0);

        if (validSuppliers.length === 0) return;

        const bounds = L.latLngBounds(
            validSuppliers.map(s => [s.latitude, s.longitude] as [number, number])
        );
        mapInstanceRef.current.fitBounds(bounds.pad(0.2));

        validSuppliers.forEach(supplier => {
            const isActive = supplier.isActive;
            const markerColor = isActive ? '#22c55e' : '#9ca3af';
            const pulseClass = isActive ? 'supplier-marker-pulse' : '';

            const icon = L.divIcon({
                className: 'supplier-marker',
                html: `
                    <div style="position: relative; width: 24px; height: 24px;">
                        <div class="${pulseClass}" style="
                            position: absolute;
                            top: -6px;
                            left: -6px;
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            background: ${markerColor}33;
                            animation: pulse-ring 2s ease-out infinite;
                        "></div>
                        <div style="
                            width: 24px;
                            height: 24px;
                            background: ${markerColor};
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        "></div>
                    </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12],
            });

            const marker = L.marker([supplier.latitude, supplier.longitude], { icon })
                .addTo(mapInstanceRef.current!)
                .bindPopup(`
                    <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
                        <strong>${supplier.name}</strong><br/>
                        <span style="color: #6b7280;">${supplier.type?.replace(/_/g, ' ')}</span><br/>
                        <span style="color: ${isActive ? '#16a34a' : '#9ca3af'}; font-weight: 500;">
                            ${isActive ? '● Active' : '● Inactive'}
                        </span><br/>
                        <span style="color: #6b7280; font-size: 11px;">${supplier.location}</span>
                    </div>
                `);

            markersRef.current.push(marker);
        });
    }, [suppliers]);

    return (
        <div
            ref={mapRef}
            className={`relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl ${className}`}
            style={{ height: '400px', width: '100%' }}
        />
    );
};

export default SupplierMap;