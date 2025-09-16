import React, { useState, useEffect } from 'react';
import {
    FaHome, FaShoppingCart, FaBox, FaTruck, FaChartLine,
    FaUser, FaCog, FaBell, FaSearch, FaBars, FaTimes,
    FaPlus, FaChevronDown, FaRupeeSign, FaRegClock, FaCheckCircle
} from 'react-icons/fa';

const VendorDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [stats, setStats] = useState({
        dailySales: 0,
        pendingOrders: 0,
        stockAlerts: 0,
        customerRating: 0
    });

    // Initialize with real data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersRes = await fetch('http://localhost:3000/orders');
                const ordersData = await ordersRes.json();
                const inventoryRes = await fetch('http://localhost:3000/inventory');
                const inventoryData = await inventoryRes.json();

                const orders = ordersData.orders;
                const inventory = inventoryData.inventory;

                // Calculate stats
                const dailySales = orders.reduce((sum, order) => order.status === 'delivered' ? sum + order.amount : sum, 0);
                const pendingOrders = orders.filter(order => order.status !== 'delivered').length;
                const stockAlerts = inventory.filter(item => item.alert).length;

                setOrders(orders);
                setInventory(inventory);
                setStats({
                    dailySales,
                    pendingOrders,
                    stockAlerts,
                    customerRating: 4.7
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Toggle sidebar on mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Hidden on mobile by default */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-orange-600 to-orange-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 border-b border-orange-500">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl">Street Food Vendor</h1>
                            <p className="text-orange-200 text-sm">Mumbai, India</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 mt-4">
                    <NavItem
                        icon={<FaHome />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <NavItem
                        icon={<FaShoppingCart />}
                        label="Orders"
                        active={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                    />
                    <NavItem
                        icon={<FaBox />}
                        label="Inventory"
                        active={activeTab === 'inventory'}
                        onClick={() => setActiveTab('inventory')}
                    />
                    <NavItem
                        icon={<FaTruck />}
                        label="Suppliers"
                        active={activeTab === 'suppliers'}
                        onClick={() => setActiveTab('suppliers')}
                    />
                    <NavItem
                        icon={<FaChartLine />}
                        label="Analytics"
                        active={activeTab === 'analytics'}
                        onClick={() => setActiveTab('analytics')}
                    />
                    <div className="mt-8 pt-4 border-t border-orange-500">
                        <NavItem
                            icon={<FaUser />}
                            label="Profile"
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                        <NavItem
                            icon={<FaCog />}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm z-20">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Mobile menu button */}
                            <div className="flex items-center">
                                <button
                                    className="lg:hidden mr-4 text-gray-600 focus:outline-none"
                                    onClick={toggleSidebar}
                                >
                                    {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                                </button>
                                <h1 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="relative hidden md:block">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                </div>

                                <button className="p-2 text-gray-600 hover:text-orange-600 relative">
                                    <FaBell size={18} />
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>

                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">VS</span>
                                    </div>
                                    <span className="ml-2 hidden sm:inline text-gray-700">Vendor Profile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    {activeTab === 'dashboard' && <DashboardTab stats={stats} orders={orders} />}
                    {activeTab === 'orders' && <OrdersTab orders={orders} />}
                    {activeTab === 'inventory' && <InventoryTab inventory={inventory} />}
                    {activeTab === 'suppliers' && <SuppliersTab />}
                    {activeTab === 'analytics' && <AnalyticsTab />}
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'settings' && <SettingsTab />}
                </main>
            </div>
        </div>
    );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, orders }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FaRupeeSign />}
                    title="Daily Sales"
                    value={`₹${stats.dailySales}`}
                    change="+12% from yesterday"
                    color="bg-green-100 text-green-600"
                />

                <StatCard
                    icon={<FaShoppingCart />}
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    change="3 orders to fulfill"
                    color="bg-yellow-100 text-yellow-600"
                />

                <StatCard
                    icon={<FaBox />}
                    title="Stock Alerts"
                    value={stats.stockAlerts}
                    change="Items need restocking"
                    color="bg-red-100 text-red-600"
                />

                <StatCard
                    icon={<FaUser />}
                    title="Customer Rating"
                    value={stats.customerRating}
                    change="Based on 45 reviews"
                    color="bg-blue-100 text-blue-600"
                    isRating={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                        <button className="text-orange-600 text-sm font-medium flex items-center gap-1">
                            View All <FaChevronDown className="text-xs" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Items</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 4).map(order => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-4">#{order.id}</td>
                                        <td className="py-4 font-medium">{order.customer}</td>
                                        <td className="py-4">{order.items}</td>
                                        <td className="py-4 font-medium">₹{order.amount}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'preparing'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
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
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Inventory Alerts</h2>

                    <div className="space-y-4">
                        <InventoryAlertItem
                            name="Onions"
                            stock={5}
                            unit="kg"
                            critical={true}
                        />

                        <InventoryAlertItem
                            name="Paneer"
                            stock={2}
                            unit="kg"
                            critical={true}
                        />

                        <InventoryAlertItem
                            name="Cooking Oil"
                            stock={3}
                            unit="liters"
                            critical={false}
                        />

                        <button className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center gap-2">
                            <FaPlus /> Order Supplies
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Daily Sales Trend</h2>
                <div className="h-64 bg-gradient-to-br from-orange-50 to-white rounded-lg flex items-center justify-center border border-orange-100">
                    <div className="text-center text-orange-500">
                        <FaChartLine className="text-4xl mx-auto mb-3" />
                        <p>Sales trend visualization</p>
                        <p className="text-sm mt-2">Daily sales performance chart</p>
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>

                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === 'preparing' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilter('preparing')}
                    >
                        Preparing
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${filter === 'delivered' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setFilter('delivered')}
                    >
                        Delivered
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                                <th className="py-3 px-4">Order #</th>
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Items</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Time</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium">#{order.id}</td>
                                    <td className="py-4 px-4">{order.customer}</td>
                                    <td className="py-4 px-4">{order.items}</td>
                                    <td className="py-4 px-4 font-medium">₹{order.amount}</td>
                                    <td className="py-4 px-4 text-gray-500">{order.time}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'preparing'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button className="text-orange-600 hover:text-orange-800 font-medium text-sm">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FaShoppingCart className="text-gray-500 text-xl" />
                        </div>
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Inventory Tab Component
const InventoryTab = ({ inventory }) => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Inventory Management</h2>

                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2">
                        <FaFilter /> Filter
                    </button>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center gap-2">
                        <FaPlus /> Add Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inventory.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">Current stock</p>
                                </div>
                                {item.alert && (
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                        Low Stock
                                    </span>
                                )}
                            </div>

                            <div className="text-3xl font-bold mb-2">
                                {item.stock} <span className="text-lg font-normal text-gray-500">{item.unit}</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div
                                    className={`h-2.5 rounded-full ${item.stock > 5 ? 'bg-green-500' : item.stock > 2 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${Math.min(100, (item.stock / 10) * 100)}%` }}
                                ></div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                                    Edit
                                </button>
                                <button className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg hover:bg-orange-200">
                                    Order More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-orange-100 transition">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                        <FaPlus />
                    </div>
                    <h3 className="font-medium text-orange-700">Add New Item</h3>
                    <p className="text-gray-500 text-sm mt-1">Add a new item to your inventory</p>
                </div>
            </div>
        </div>
    );
};

// Suppliers Tab Component
const SuppliersTab = () => {
    const suppliers = [
        { id: 1, name: 'Fresh Agro Supplies', rating: 4.8, delivery: 'Same Day', products: ['Vegetables', 'Fruits'] },
        { id: 2, name: 'Mumbai Dairy Products', rating: 4.5, delivery: 'Next Day', products: ['Milk', 'Paneer', 'Cheese'] },
        { id: 3, name: 'Spice Traders', rating: 4.7, delivery: 'Same Day', products: ['Spices', 'Masalas'] },
        { id: 4, name: 'Quality Grains Co.', rating: 4.3, delivery: 'Next Day', products: ['Rice', 'Wheat', 'Flour'] },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Suppliers</h2>

                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2">
                        <FaFilter /> Filter
                    </button>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center gap-2">
                        <FaPlus /> New Supplier
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map(supplier => (
                    <div key={supplier.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold">{supplier.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{supplier.name}</h3>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500 font-medium">{supplier.rating}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">
                                                {i < Math.floor(supplier.rating) ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-500 text-sm mb-1">Delivery</p>
                            <p className="font-medium flex items-center gap-2">
                                <FaTruck className="text-orange-500" /> {supplier.delivery}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-500 text-sm mb-1">Products</p>
                            <div className="flex flex-wrap gap-2">
                                {supplier.products.map((product, idx) => (
                                    <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                                        {product}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button className="w-full mt-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg">
                            Place Order
                        </button>
                    </div>
                ))}

                <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-orange-100 transition">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                        <FaPlus />
                    </div>
                    <h3 className="font-medium text-orange-700">Add New Supplier</h3>
                    <p className="text-gray-500 text-sm mt-1">Connect with a new supplier</p>
                </div>
            </div>
        </div>
    );
};

// Analytics Tab Component
const AnalyticsTab = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Business Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Sales Overview</h3>
                    <div className="h-64 bg-gradient-to-br from-orange-50 to-white rounded-lg flex items-center justify-center border border-orange-100">
                        <div className="text-center text-orange-500">
                            <FaChartLine className="text-4xl mx-auto mb-3" />
                            <p>Sales performance chart</p>
                            <p className="text-sm mt-2">Daily, weekly and monthly sales trends</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Popular Items</h3>
                    <div className="h-64 bg-gradient-to-br from-orange-50 to-white rounded-lg flex items-center justify-center border border-orange-100">
                        <div className="text-center text-orange-500">
                            <FaBox className="text-4xl mx-auto mb-3" />
                            <p>Product popularity chart</p>
                            <p className="text-sm mt-2">Top selling menu items</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Customer Insights</h3>
                <div className="h-96 bg-gradient-to-br from-orange-50 to-white rounded-lg flex items-center justify-center border border-orange-100">
                    <div className="text-center text-orange-500">
                        <FaUser className="text-4xl mx-auto mb-3" />
                        <p>Customer demographics and behavior</p>
                        <p className="text-sm mt-2">Peak hours, repeat customers, and feedback</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Profile Tab Component
const ProfileTab = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Vendor Profile</h2>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mb-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-28 h-28" />
                        </div>
                        <button className="text-orange-600 font-medium">Upload Photo</button>
                        <div className="mt-6 text-center">
                            <h3 className="text-lg font-bold">Street Food Vendor</h3>
                            <p className="text-gray-500">Mumbai, India</p>
                            <div className="flex items-center justify-center mt-2 gap-1">
                                <span className="text-yellow-500 font-medium">4.7</span>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <h3 className="font-semibold text-gray-800 mb-4">Business Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">Business Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    value="Street Food Vendor"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    value="Mumbai, India"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    value="+91 98765 43210"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    value="vendor@example.com"
                                />
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-800 mb-4">Business Hours</h3>
                        <div className="bg-orange-50 rounded-lg p-4 mb-6">
                            <p className="font-medium flex items-center gap-2">
                                <FaRegClock className="text-orange-500" /> 8:00 AM - 10:00 PM, Monday to Sunday
                            </p>
                        </div>

                        <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-lg">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Settings Tab Component
const SettingsTab = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b">
                    <button className="px-6 py-4 text-left font-medium text-orange-600 border-b-2 border-orange-600">
                        Account Settings
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Notification Preferences</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span>New Order Alerts</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Stock Alerts</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Promotional Offers</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Security</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">Change Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <button className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Components
const NavItem = ({ icon, label, active, onClick }) => (
    <button
        className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 transition-all ${active ? 'bg-white text-orange-600 shadow' : 'text-orange-100 hover:bg-orange-700'
            }`}
        onClick={onClick}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const StatCard = ({ icon, title, value, change, color, isRating }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-600 mb-1">{title}</p>
                <h3 className={`text-2xl font-bold ${isRating ? 'text-yellow-500' : 'text-gray-800'}`}>
                    {isRating ? (
                        <span className="flex items-center">
                            {value}
                            <span className="text-yellow-400 ml-1">★</span>
                        </span>
                    ) : (
                        value
                    )}
                </h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">{change}</p>
    </div>
);

const InventoryAlertItem = ({ name, stock, unit, critical }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${critical ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
            <FaBox />
        </div>
        <div>
            <h4 className="font-medium text-gray-800">{name}</h4>
            <p className={`text-sm ${critical ? 'text-red-600' : 'text-yellow-600'}`}>
                {critical ? 'Low Stock' : 'Moderate Stock'}: {stock} {unit}
            </p>
        </div>
        <button className="ml-auto text-orange-600 hover:text-orange-800">
            Order
        </button>
    </div>
);

export default VendorDashboard;