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

<<<<<<< HEAD
        {/* Interactive Map Embed */}
        <div className="w-full h-2/3 rounded-2xl overflow-hidden mt-8 border border-gray-100 shadow-inner relative group">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.77587890625001%2C18.895892305367687%2C73.05053710937501%2C19.124434252541907&amp;layer=mapnik&amp;marker=19.010161404092552%2C72.9132080078125"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none flex flex-col justify-end p-4">
            <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80">Order Status</p>
            <p className="text-white text-lg font-black">Out for Delivery in Mumbai</p>
          </div>
        </div>

        {/* Message inside card */}
        <div className="text-center text-gray-400 text-sm mt-4">
          Real-time GPS tracking active. Your agent <span className="text-orange-600 font-bold">Rajesh</span> is 2.4 km away.
=======
        {/* Message inside card */}
        <div className="text-center text-gray-500 text-lg font-medium mt-8">
          Real-time tracking of your order.<br />
          Click the truck above to view live location.
>>>>>>> 9bdae445493da8ec4ea2d8640cb4e2501e7503c3
        </div>
      </div>
    </div>
  );
}
