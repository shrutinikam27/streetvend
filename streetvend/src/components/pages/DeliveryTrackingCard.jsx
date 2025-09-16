import React from 'react';
import { FaTruck } from 'react-icons/fa';

export default function DeliveryTrackingCard({ onClose }) {
  const destinationLatitude = 28.6139;  
  const destinationLongitude = 77.2090;

  const handleTrackClick = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destinationLatitude},${destinationLongitude}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-2xl h-96 rounded-xl overflow-hidden shadow-2xl bg-white flex flex-col items-center justify-center p-6">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close"
        >
          &#x2715;
        </button>

        {/* Truck Badge (Clickable) */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full shadow-xl cursor-pointer transition hover:scale-105 z-10"
          onClick={handleTrackClick}
          title="Track your delivery"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white animate-pulse">
            <FaTruck className="text-xl" />
          </div>
        </div>

        {/* Message inside card */}
        <div className="text-center text-gray-500 text-lg font-medium mt-8">
          Real-time tracking of your order.<br />
          Click the truck above to view live location.
        </div>
      </div>
    </div>
  );
}
