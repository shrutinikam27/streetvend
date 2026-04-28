import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Custom icon for the delivery vehicle
const deliveryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/726/726051.png', // Delivery truck icon
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
});

// Component to dynamically center the map when location changes
const RecenterMap = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView([location.lat, location.lng], map.getZoom());
        }
    }, [location, map]);
    return null;
};

const LiveMap = ({ center, markers = [], zoom = 13, height = "400px" }) => {
    // Default center if none provided
    const defaultCenter = center || { lat: 17.6844, lng: 73.9895 }; // Default to Satara, Maharashtra

    return (
        <div style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden', zIndex: 0 }}>
            <MapContainer 
                center={[defaultCenter.lat, defaultCenter.lng]} 
                zoom={zoom} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {markers.map((marker, index) => (
                    <Marker 
                        key={index} 
                        position={[marker.lat, marker.lng]}
                        icon={marker.type === 'delivery' ? deliveryIcon : new L.Icon.Default()}
                    >
                        {marker.label && (
                            <Popup>
                                {marker.label}
                            </Popup>
                        )}
                    </Marker>
                ))}

                {center && <RecenterMap location={center} />}
            </MapContainer>
        </div>
    );
};

export default LiveMap;
