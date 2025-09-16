import React, { useState } from 'react';
import { FaBuilding, FaChartLine, FaUsers, FaTruck, FaCheckCircle, FaRupeeSign } from 'react-icons/fa';

const BecomeSupplier = () => {
    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        city: '',
        productCategory: '',
        minOrder: '',
        deliveryRange: ''
    });

    const benefits = [
        {
            icon: <FaUsers className="text-3xl text-orange-500" />,
            title: "Access to Thousands of Vendors",
            description: "Connect with verified street food vendors in your area"
        },
        {
            icon: <FaChartLine className="text-3xl text-orange-500" />,
            title: "Grow Your Business",
            description: "Increase sales volume by 40% with our vendor network"
        },
        {
            icon: <FaTruck className="text-3xl text-orange-500" />,
            title: "Efficient Order Management",
            description: "Streamlined order processing and delivery tracking"
        },
        {
            icon: <FaRupeeSign className="text-3xl text-orange-500" />,
            title: "Faster Payments",
            description: "Secure and timely payments through multiple options"
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        data.append("access_key", "227e42cf-5cc7-48a8-89bd-c8df73094c4a");

        const object = Object.fromEntries(data);
        const json = JSON.stringify(object);

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: json
        }).then((res) => res.json());

        if (res.success) {
            console.log("Success", res);
            alert('Application submitted successfully! Our team will contact you shortly.');
            form.reset();
            setFormData({
                name: '',
                businessName: '',
                email: '',
                phone: '',
                city: '',
                productCategory: '',
                minOrder: '',
                deliveryRange: ''
            });
        } else {
            alert("Submission failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20 pb-20">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                        Become a Verified Supplier
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join Vendorverse to expand your customer base and grow your business with India's largest street food vendor network
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                                <FaBuilding className="text-orange-500 mr-3" />
                                Supplier Benefits
                            </h2>
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mr-6">
                                            {benefit.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                                            <p className="text-gray-600">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <FaCheckCircle className="mr-3" />
                                Requirements to Join
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start"><div className="mt-1 mr-3">•</div><p>Valid business registration (GSTIN required)</p></li>
                                <li className="flex items-start"><div className="mt-1 mr-3">•</div><p>Minimum 1 year of business operations</p></li>
                                <li className="flex items-start"><div className="mt-1 mr-3">•</div><p>Ability to handle daily orders</p></li>
                                <li className="flex items-start"><div className="mt-1 mr-3">•</div><p>Own delivery capability or tie-up with delivery service</p></li>
                                <li className="flex items-start"><div className="mt-1 mr-3">•</div><p>Commitment to quality and freshness</p></li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Supplier Application</h2>
                        <form onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">City</label>
                                <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                                    <option value="">Select City</option>
                                    <option value="mumbai">Mumbai</option>
                                    <option value="delhi">Delhi</option>
                                    <option value="bangalore">Bangalore</option>
                                    <option value="chennai">Chennai</option>
                                    <option value="kolkata">Kolkata</option>
                                    <option value="hyderabad">Hyderabad</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Product Category</label>
                                    <select name="productCategory" value={formData.productCategory} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                                        <option value="">Select Category</option>
                                        <option value="vegetables">Vegetables</option>
                                        <option value="fruits">Fruits</option>
                                        <option value="spices">Spices & Masalas</option>
                                        <option value="meat">Meat & Poultry</option>
                                        <option value="dairy">Dairy Products</option>
                                        <option value="oil">Cooking Oil</option>
                                        <option value="grains">Flour & Grains</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Minimum Order Value</label>
                                    <input type="text" name="minOrder" value={formData.minOrder} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" placeholder="e.g. ₹1,500" required />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-gray-700 mb-2">Delivery Range (in km)</label>
                                <input type="text" name="deliveryRange" value={formData.deliveryRange} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" placeholder="e.g. 10" required />
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Apply Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeSupplier;