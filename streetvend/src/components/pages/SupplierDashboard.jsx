import React, { useState, useEffect } from 'react';
import { FaTruck, FaClipboardList, FaChartLine, FaUsers, FaBox, FaRupeeSign, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaChevronDown, FaArrowRight, FaMap, FaMapMarkerAlt, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const SupplierDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        revenue: 0
    });

    // Initialize with real data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersRes = await fetch('http://localhost:3000/orders');
                const ordersData = await ordersRes.json();
                const productsRes = await fetch('http://localhost:3000');
                const productsData = await productsRes.json();

                const orders = ordersData.orders;
                const products = productsData.items;

                // Calculate stats
                const totalOrders = orders.length;
                const pendingOrders = orders.filter(order => order.status === 'pending').length;
                const completedOrders = orders.filter(order => order.status === 'completed').length;
                const revenue = orders.reduce((sum, order) => order.status === 'completed' ? sum + order.amount : sum, 0);

                setOrders(orders);
                setProducts(products);
                setStats({
                    totalOrders,
                    pendingOrders,
                    completedOrders,
                    revenue
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-orange-600 to-orange-800 text-white shadow-xl">
                <div className="p-6 border-b border-orange-500">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <FaBox className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl">Supplier Dashboard</h1>
                            <p className="text-orange-200 text-sm">Agro Products Ltd.</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 mt-4">
                    <button
                        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'dashboard' ? 'bg-white text-orange-600' : 'text-orange-100 hover:bg-orange-700'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <FaChartLine />
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'orders' ? 'bg-white text-orange-600' : 'text-orange-100 hover:bg-orange-700'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FaClipboardList />
                        <span>Orders</span>
                    </button>

                    <button
                        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'products' ? 'bg-white text-orange-600' : 'text-orange-100 hover:bg-orange-700'}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <FaBox />
                        <span>Products</span>
                    </button>

                    <button
                        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'delivery' ? 'bg-white text-orange-600' : 'text-orange-100 hover:bg-orange-700'}`}
                        onClick={() => setActiveTab('delivery')}
                    >
                        <FaTruck />
                        <span>Delivery</span>
                    </button>

                    <button
                        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 transition-all ${activeTab === 'vendors' ? 'bg-white text-orange-600' : 'text-orange-100 hover:bg-orange-700'}`}
                        onClick={() => setActiveTab('vendors')}
                    >
                        <FaUsers />
                        <span>Vendors</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-orange-700 p-4 rounded-lg">
                        <p className="text-sm mb-2">Need help?</p>
                        <button className="bg-white text-orange-600 w-full py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Top Bar */}
                <div className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                        {activeTab === 'orders' && (
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                                {stats.pendingOrders} pending
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold">SP</span>
                            </div>
                            <span className="font-medium">Supplier Profile</span>
                            <FaChevronDown className="text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                    {activeTab === 'dashboard' && <DashboardOverview stats={stats} orders={orders} />}
                    {activeTab === 'orders' && <OrdersTab orders={orders} />}
                    {activeTab === 'products' && <ProductsTab products={products} />}
                    {activeTab === 'delivery' && <DeliveryTab orders={orders} />}
                    {activeTab === 'vendors' && <VendorsTab />}
                </div>
            </div>
        </div>
    );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats, orders }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FaClipboardList className="text-2xl" />}
                    title="Total Orders"
                    value={stats.totalOrders}
                    change="+12% from last month"
                    color="bg-blue-100 text-blue-600"
                />

                <StatCard
                    icon={<FaTruck className="text-2xl" />}
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    change="+3 since yesterday"
                    color="bg-yellow-100 text-yellow-600"
                />

                <StatCard
                    icon={<FaCheckCircle className="text-2xl" />}
                    title="Completed Orders"
                    value={stats.completedOrders}
                    change="+8% from last month"
                    color="bg-green-100 text-green-600"
                />

                <StatCard
                    icon={<FaRupeeSign className="text-2xl" />}
                    title="Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    change="+15% from last month"
                    color="bg-purple-100 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                        <button className="text-orange-600 text-sm font-medium flex items-center gap-1">
                            View All <FaArrowRight className="text-xs" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Vendor</th>
                                    <th className="pb-3">Items</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-4">#{order.id}</td>
                                        <td className="py-4 font-medium">{order.vendor}</td>
                                        <td className="py-4">{order.items}</td>
                                        <td className="py-4 font-medium">₹{order.amount.toLocaleString()}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Products</h2>

                    <div className="space-y-4">
                        <ProductItem
                            name="Potatoes (1kg)"
                            category="Vegetables"
                            stock={150}
                            sales={45}
                        />

                        <ProductItem
                            name="Onions (1kg)"
                            category="Vegetables"
                            stock={200}
                            sales={38}
                        />

                        <ProductItem
                            name="Cooking Oil (1L)"
                            category="Oils"
                            stock={80}
                            sales={32}
                        />

                        <ProductItem
                            name="Wheat Flour (5kg)"
                            category="Flours"
                            stock={60}
                            sales={28}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Revenue</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <FaChartLine className="text-4xl mx-auto mb-3" />
                        <p>Revenue chart visualization</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Orders Tab Component
const OrdersTab = ({ orders }) => {
    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>

                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => navigate('/createorder')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaPlus /> Create Order
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Vendor</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-4 font-medium">#{order.id}</td>
                                <td className="py-4 px-4">{order.vendor}</td>
                                <td className="py-4 px-4">{order.date}</td>
                                <td className="py-4 px-4">{order.items}</td>
                                <td className="py-4 px-4 font-medium">₹{order.amount.toLocaleString()}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-2">
                                        {order.status === 'pending' && (
                                            <button className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200">
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                        <button className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200">
                                            <FaEdit />
                                        </button>
                                        <button className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Showing 1 to {filteredOrders.length} of {orders.length} entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                            Previous
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-orange-600 text-white">
                            1
                        </button>
                        <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Products Tab Component
const ProductsTab = ({ products }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Product Inventory</h2>

                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <FaPlus /> Add Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                                    <p className="text-gray-500 text-sm">{product.category}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                    In Stock
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Stock</p>
                                    <p className="font-medium">{product.stock} units</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Price</p>
                                    <p className="font-medium">₹{product.price}/unit</p>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div
                                    className="bg-orange-600 h-2.5 rounded-full"
                                    style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                                ></div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
                                    <FaEdit /> Edit
                                </button>
                                <button className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2">
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Delivery Tab Component
const DeliveryTab = ({ orders }) => {
    // Filter only pending orders for delivery
    const pendingOrders = orders.filter(order => order.status === 'pending');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Delivery Management</h2>

                <div className="flex gap-4">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <FaPlus /> Schedule Delivery
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Today's Deliveries</h3>

                    <div className="space-y-4">
                        {pendingOrders.slice(0, 3).map(order => (
                            <div key={order.id} className="border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium">#{order.id} - {order.vendor}</h4>
                                        <p className="text-gray-500 text-sm">{order.items} items</p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                        Pending
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <FaMapMarkerAlt className="text-orange-500" />
                                    <span>Mumbai Central</span>
                                </div>

                                <div className="mt-3">
                                    <button className="w-full bg-orange-100 text-orange-700 py-2 rounded-lg hover:bg-orange-200">
                                        Start Delivery
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Delivery Map</h3>

                    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <FaMap className="text-4xl mx-auto mb-3" />
                            <p>Interactive delivery map visualization</p>
                            <p className="text-sm mt-2">Showing delivery routes and vendor locations</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="font-semibold text-gray-800">Delivery History</h3>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Vendor</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Driver</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter(o => o.status === 'completed').slice(0, 5).map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-4 font-medium">#{order.id}</td>
                                <td className="py-4 px-4">{order.vendor}</td>
                                <td className="py-4 px-4">{order.date}</td>
                                <td className="py-4 px-4">Ramesh Kumar</td>
                                <td className="py-4 px-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                        Delivered
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <button className="text-orange-600 hover:text-orange-700">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Vendors Tab Component
const VendorsTab = () => {
    const vendors = [
        { id: 1, name: 'Rajesh Kumar', location: 'Mumbai', orders: 24, rating: 4.7 },
        { id: 2, name: 'Priya Foods', location: 'Delhi', orders: 18, rating: 4.5 },
        { id: 3, name: 'Mumbai Chaat Corner', location: 'Mumbai', orders: 32, rating: 4.9 },
        { id: 4, name: 'Delhi Street Foods', location: 'Delhi', orders: 15, rating: 4.3 },
        { id: 5, name: 'Chennai Snacks', location: 'Chennai', orders: 21, rating: 4.6 },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Vendor Management</h2>

                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <FaPlus /> Add Vendor
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vendors.map(vendor => (
                    <div key={vendor.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">{vendor.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{vendor.name}</h3>
                                <p className="text-gray-500 text-sm">{vendor.location}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <p className="font-medium">{vendor.orders}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Rating</p>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{vendor.rating}</span>
                                    <FaStar className="text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                                View Profile
                            </button>
                            <button className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg hover:bg-orange-200">
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Vendor Locations</h3>

                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <FaMap className="text-4xl mx-auto mb-3" />
                        <p>Vendor location map visualization</p>
                        <p className="text-sm mt-2">Showing all registered vendor locations</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Components
const StatCard = ({ icon, title, value, change, color }) => (
    <div className={`${color} rounded-xl p-6 shadow-sm`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className="bg-white/30 p-3 rounded-lg">
                {icon}
            </div>
        </div>
        <p className="text-xs mt-4 opacity-80">{change}</p>
    </div>
);

const ProductItem = ({ name, category, stock, sales }) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white">
            <FaBox />
        </div>
        <div className="flex-1">
            <h4 className="font-medium text-gray-800">{name}</h4>
            <p className="text-gray-500 text-sm">{category}</p>
        </div>
        <div className="text-right">
            <p className="font-medium">{sales} sold</p>
            <p className="text-gray-500 text-sm">{stock} in stock</p>
        </div>
    </div>
);

export default SupplierDashboard;