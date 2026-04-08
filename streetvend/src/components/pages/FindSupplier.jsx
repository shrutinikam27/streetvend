import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaTruck, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import API_URL from '../../config';

const FindSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewingSupplier, setViewingSupplier] = useState(null);

    const categories = ['All', 'Vegetables', 'Fruits', 'Spices', 'Dairy', 'Grains', 'Meat'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supRes = await fetch(`${API_URL}/api/auth/suppliers`);
                const supData = await supRes.json();
                
                const prodRes = await fetch(`${API_URL}/api/products`);
                const prodData = await prodRes.json();
                
                // Map real data to the UI format
                const formattedSuppliers = supData.map(s => {
                    const supplierProducts = prodData.filter(p => {
                        const pSupplierId = p.supplier?._id || p.supplier;
                        return pSupplierId && String(pSupplierId) === String(s._id);
                    });
                    return {
                        id: s._id,
                        name: s.businessName || s.name,
                        realName: s.name,
                        rating: s.rating || 4.5,
                        distance: s.city ? s.city.charAt(0).toUpperCase() + s.city.slice(1) : (1 + Math.random() * 5).toFixed(1) + " km",
                        specialties: [...new Set(supplierProducts.map(p => p.category))],
                        deliveryTime: s.deliveryTime || "1-3 hours",
                        minOrder: s.minOrder || "₹1,000",
                        products: supplierProducts
                    };
                });

                // If no real suppliers found, fall back to mock data for demo
                if (formattedSuppliers.length === 0) {
                   setSuppliers(mockSuppliers);
                } else {
                   setSuppliers(formattedSuppliers);
                }
                setProducts(prodData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setSuppliers(mockSuppliers);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mockSuppliers = [
        {
            id: 1,
            name: "Satara Fresh Veg",
            rating: 4.8,
            distance: "1.2 km (Powai Naka)",
            specialties: ["Vegetables", "Fruits", "Grains"],
            deliveryTime: "45 mins",
            minOrder: "₹800",
            products: [
                { _id: 'm1', name: 'Fresh Potatoes', price: 30, category: 'Vegetables', description: 'Grown in local Satara farms' },
                { _id: 'm2', name: 'Satara Onions', price: 45, category: 'Vegetables', description: 'High quality red onions' }
            ]
        },
        {
            id: 2,
            name: "Wai Highland Spices",
            rating: 4.9,
            distance: "12 km (Wai)",
            specialties: ["Spices", "Masalas", "Oil"],
            deliveryTime: "Same day",
            minOrder: "₹1,200",
            products: [
                { _id: 'm3', name: 'Pure Turmeric', price: 150, category: 'Spices', description: 'Wai special organic turmeric' },
                { _id: 'm4', name: 'Garam Masala', price: 90, category: 'Spices', description: 'Traditional Satara blend' }
            ]
        },
        {
            id: 3,
            name: "Karad Dairy Hub",
            rating: 4.6,
            distance: "45 km (Karad)",
            specialties: ["Milk", "Paneer", "Ghee"],
            deliveryTime: "Next morning",
            minOrder: "₹2,500",
            products: [
                { _id: 'm5', name: 'Fresh Paneer', price: 320, category: 'Dairy', description: 'Soft farm-fresh paneer' },
                { _id: 'm6', name: 'Desi Ghee', price: 650, category: 'Dairy', description: 'Pure buffalo milk ghee' }
            ]
        },
        {
            id: 4,
            name: "Mahabaleshwar Berries",
            rating: 4.7,
            distance: "55 km (Mahabaleshwar)",
            specialties: ["Strawberries", "Jams", "Syrups"],
            deliveryTime: "Next day",
            minOrder: "₹1,000",
            products: [
                { _id: 'm7', name: 'Fresh Strawberries', price: 180, category: 'Fruits', description: 'World famous Mahabaleshwar berries' }
            ]
        },
        {
            id: 5,
            name: "Koregaon Grain Traders",
            rating: 4.4,
            distance: "18 km (Koregaon)",
            specialties: ["Wheat", "Pulses", "Grains"],
            deliveryTime: "24 hours",
            minOrder: "₹3,000",
            products: [
                { _id: 'm8', name: 'Premium Wheat', price: 420, category: 'Grains', description: 'High quality Koregaon wheat (10kg)' }
            ]
        }
    ];

    const filteredSuppliers = suppliers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             s.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Slightly lenient category matching
        const matchesCategory = selectedCategory === 'All' || 
                              s.specialties.some(spec => spec.toLowerCase() === selectedCategory.toLowerCase() || 
                                                       spec.toLowerCase().includes(selectedCategory.toLowerCase()));
        return matchesSearch && matchesCategory;
    });

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                            Search
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-12 justify-center">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all border ${
                                selectedCategory === cat 
                                ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105' 
                                : 'bg-white text-orange-500 border-orange-300 hover:bg-orange-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Supplier List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {filteredSuppliers.map(supplier => (
                        <div key={supplier.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-xl transition-all duration-300">
                            {/* Supplier Header */}
                            <div className="p-6 border-b border-orange-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{supplier.name}</h3>
                                        {supplier.realName && supplier.realName !== supplier.name && (
                                            <p className="text-xs text-gray-500 italic">Prop: {supplier.realName}</p>
                                        )}
                                        <div className="flex items-center mt-2">
                                            <div className="flex text-orange-500 mr-2">
                                                {renderStars(supplier.rating)}
                                            </div>
                                            <span className="text-gray-600">{supplier.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaMapMarkerAlt className="text-orange-500 mr-1" />
                                        <span className="capitalize">{supplier.distance}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Supplier Details */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="text-gray-700 font-medium mb-2">Specializes in:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {supplier.specialties.length > 0 ? supplier.specialties.map((item, index) => (
                                            <span key={index} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                                                {item}
                                            </span>
                                        )) : (
                                            <span className="text-gray-400 text-sm italic">General supplier</span>
                                        )}
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
                                <button 
                                    onClick={() => setViewingSupplier(supplier)}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg mr-2 font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                                >
                                    View Products
                                </button>
                                <a 
                                    href={`https://wa.me/${supplier.phone || ''}?text=Hello, I'm interested in your products on StreetVend`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-orange-300 rounded-lg text-orange-500 hover:bg-orange-100 transition-colors"
                                >
                                    <FaWhatsapp className="text-xl" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Product Modal */}
                {viewingSupplier && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold">{viewingSupplier.name}</h3>
                                    <p className="opacity-90">{viewingSupplier.products ? viewingSupplier.products.length : 0} Products in Catalog</p>
                                </div>
                                <button 
                                    onClick={() => setViewingSupplier(null)}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-8">
                                {viewingSupplier.products && viewingSupplier.products.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {viewingSupplier.products.map(product => (
                                            <div key={product._id} className="flex bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-orange-200 transition-all">
                                                <div className="h-20 w-20 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
                                                    <span className="text-2xl font-bold">{product.name.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-gray-800">{product.name}</h4>
                                                        <span className="text-orange-600 font-bold">₹{product.price}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{product.description || 'Verified fresh quality'}</p>
                                                    <div className="mt-2">
                                                        <span className="text-xs bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-600">
                                                            {product.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="text-6xl mb-4">📦</div>
                                        <h4 className="text-xl font-bold text-gray-800">No products listed yet</h4>
                                        <p className="text-gray-500 mt-2">This supplier hasn't added any products to their catalog.</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 border-t bg-gray-50 flex justify-end">
                                <button 
                                    onClick={() => setViewingSupplier(null)}
                                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all mr-4"
                                >
                                    Close
                                </button>
                                <a 
                                    href={`https://wa.me/${viewingSupplier.phone || ''}?text=Hello, I saw your product list for ${viewingSupplier.name} on StreetVend`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center"
                                >
                                    <FaWhatsapp className="mr-2" /> Inquiry Now
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindSuppliers;