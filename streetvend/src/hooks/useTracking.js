import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import API_URL from '../config';

// The socket URL should be the same as the backend API URL
const SOCKET_URL = API_URL.replace('/api', '') || 'http://localhost:5007';

export const useTracking = (orderId, isSupplier = false) => {
    const socketRef = useRef(null);
    const [location, setLocation] = useState(null);
    const [othersLocations, setOthersLocations] = useState({});
    const watchIdRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Connected to tracking server');
            if (orderId) {
                socketRef.current.emit('join-order', orderId);
            }
        });

        // Listen for location updates from others
        socketRef.current.on('location-updated', (data) => {
            if (data.orderId === orderId) {
                setOthersLocations(prev => ({
                    ...prev,
                    [data.supplierId]: data.location
                }));
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [orderId]);

    // Function for suppliers to start broadcasting their location
    const startTracking = (supplierId) => {
        if (!isSupplier || !navigator.geolocation) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setLocation(newLocation);

                // Send update to server
                if (socketRef.current && orderId) {
                    socketRef.current.emit('update-location', {
                        orderId,
                        supplierId,
                        location: newLocation
                    });
                }
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    return {
        location,
        othersLocations,
        startTracking,
        stopTracking
    };
};
