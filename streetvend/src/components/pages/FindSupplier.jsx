import React from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaTruck, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const FindSuppliers = () => {
    const suppliers = [
        {
            id: 1,
            name: "Fresh Agro Products",
            rating: 4.7,
            distance: "2.5 km",
            specialties: ["Vegetables", "Fruits", "Dairy"],
            deliveryTime: "1-2 hours",
            minOrder: "₹2,000"
        },
        {
            id: 2,
            name: "Mumbai Spice House",
            rating: 4.9,
            distance: "1.8 km",
            specialties: ["Spices", "Masalas", "Oil"],
            deliveryTime: "Same day",
            minOrder: "₹1,500"
        },
        {
            id: 3,
            name: "Delhi Flour Mills",
            rating: 4.5,
            distance: "3.2 km",
            specialties: ["Wheat Flour", "Rice", "Pulses"],
            deliveryTime: "Next morning",
            minOrder: "₹3,000"
        },
        {
            id: 4,
            name: "Bangalore Meat Suppliers",
            rating: 4.8,
            distance: "4.1 km",
            specialties: ["Chicken", "Mutton", "Fish"],
            deliveryTime: "2-3 hours",
            minOrder: "₹5,000"
        }
    ];

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
        }

        return stars;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20 pb-20">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                        Find Verified Suppliers for Your Business
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Connect with trusted suppliers near you offering fresh ingredients at competitive prices
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-2 flex">
                        <div className="flex-1 flex items-center pl-4">
                            <FaSearch className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search for vegetables, spices, meat, dairy..."
                                className="w-full py-4 outline-none text-gray-700"
                            />
                        </div>
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                            Search
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-12 justify-center">
                    <button className="px-6 py-3 bg-white border border-orange-300 rounded-xl text-orange-500 font-medium hover:bg-orange-50 transition-all">
                        Vegetables
                    </button>
                    <button className="px-6 py-3 bg-white border border-orange-300 rounded-xl text-orange-500 font-medium hover:bg-orange-50 transition-all">
                        Spices & Masalas
                    </button>
                    <button className="px-6 py-3 bg-white border border-orange-300 rounded-xl text-orange-500 font-medium hover:bg-orange-50 transition-all">
                        Meat & Poultry
                    </button>
                    <button className="px-6 py-3 bg-white border border-orange-300 rounded-xl text-orange-500 font-medium hover:bg-orange-50 transition-all">
                        Dairy Products
                    </button>
                    <button className="px-6 py-3 bg-white border border-orange-300 rounded-xl text-orange-500 font-medium hover:bg-orange-50 transition-all">
                        Cooking Oil
                    </button>
                    <button className="px-6 py-3 bg-white border border-orange-300 rounded-xl text-orange-500 font-medium hover:bg-orange-50 transition-all">
                        Flour & Grains
                    </button>
                </div>

                {/* Supplier List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {suppliers.map(supplier => (
                        <div key={supplier.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-xl transition-all duration-300">
                            {/* Supplier Header */}
                            <div className="p-6 border-b border-orange-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{supplier.name}</h3>
                                        <div className="flex items-center mt-2">
                                            <div className="flex text-orange-500 mr-2">
                                                {renderStars(supplier.rating)}
                                            </div>
                                            <span className="text-gray-600">{supplier.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaMapMarkerAlt className="text-orange-500 mr-1" />
                                        <span>{supplier.distance}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Supplier Details */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="text-gray-700 font-medium mb-2">Specializes in:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {supplier.specialties.map((item, index) => (
                                            <span key={index} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <p className="text-gray-500 text-sm">Delivery Time</p>
                                        <p className="font-medium flex items-center">
                                            <FaTruck className="text-orange-500 mr-2" />
                                            {supplier.deliveryTime}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Min. Order</p>
                                        <p className="font-medium">{supplier.minOrder}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Supplier Footer */}
                            <div className="p-4 bg-orange-50 flex justify-between">
                                <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg mr-2 font-medium hover:from-orange-600 hover:to-orange-700 transition-all">
                                    View Products
                                </button>
                                <button className="w-12 h-12 flex items-center justify-center bg-white border border-orange-300 rounded-lg text-orange-500 hover:bg-orange-100">
                                    <FaWhatsapp className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FindSuppliers;