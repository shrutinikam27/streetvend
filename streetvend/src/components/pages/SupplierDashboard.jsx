import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    FaLayerGroup, FaBox, FaClipboardList, FaTruck, FaChartBar, FaUserCircle,
    FaBell, FaSignOutAlt, FaPlus, FaTrash, FaRupeeSign, FaSearch, FaFilter,
    FaChevronRight, FaMapMarkerAlt, FaCheckCircle, FaUsers
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import API_URL from '../../config';
import LiveMap from '../common/LiveMap';
import { useTracking } from '../../hooks/useTracking';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const SupplierDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [addProductModal, setAddProductModal] = useState(false);

    // Tracking hook
    const { location, startTracking, stopTracking } = useTracking(trackingOrderId, true);

    // Fetch Data
    const fetchData = async () => {
        try {
            const ordersRes = await fetch(`${API_URL}/api/orders?supplierId=${user?.id}`);
            const ordersData = await ordersRes.json();
            const productsRes = await fetch(`${API_URL}/api/products?supplierId=${user?.id}`);
            const productsData = await productsRes.json();

            setOrders(ordersData.orders || []);
            setProducts(productsData || []);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleAddProduct = async (productData) => {
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                alert('Product listed successfully!');
                setAddProductModal(false);
                fetchData();
            } else {
                const errText = await res.text();
                alert(`Failed to list product: ${errText}`);
            }
        } catch (err) {
            console.error(err);
            alert('A network error occurred while adding the product.');
        }
    };

    const handleOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                alert(`Order marked as ${newStatus}!`);
                fetchData();
            } else {
                alert('Failed to update order status');
            }
        } catch (err) {
            console.error(err);
            alert('A network error occurred');
        }
    };

    const handleVerifyAddress = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ isAddressVerified: true })
            });
            if (res.ok) {
                alert('Delivery address verified!');
                fetchData();
            } else {
                alert('Failed to verify address');
            }
        } catch (err) {
            console.error(err);
            alert('A network error occurred');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                alert('Order deleted successfully!');
                fetchData();
            } else {
                alert('Failed to delete order');
            }
        } catch (err) {
            console.error(err);
            alert('Network error while deleting order');
        }
    };

    const stats = {
        totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        activeProducts: products.length,
        vendorPartners: new Set(orders.map(o => o.vendor)).size
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-[#111827] border-r border-slate-800 transition-all duration-300 flex flex-col z-50 shadow-2xl`}>
                <div className="p-6 flex items-center gap-4 border-b border-slate-800 h-20 bg-slate-900/50">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                        <FaTruck className="text-white text-xl" />
                    </div>
                    {sidebarOpen && <h1 className="font-black text-xl tracking-tighter text-white whitespace-nowrap">StreetVend <span className="text-blue-500 text-[10px] uppercase tracking-widest block font-bold mt-[-4px]">Supplier Hub</span></h1>}
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">

                    <SidebarLink icon={<FaBox />} label="Product Catalog" active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} open={sidebarOpen} color="blue" />
                    <SidebarLink icon={<FaClipboardList />} label="Purchase Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} open={sidebarOpen} color="blue" badge={stats.pendingOrders} />
                    <SidebarLink icon={<FaTruck />} label="Live Logistics" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} open={sidebarOpen} color="blue" />
                    <SidebarLink icon={<FaChartBar />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} open={sidebarOpen} color="blue" />
                    <SidebarLink icon={<FaUserCircle />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} open={sidebarOpen} color="blue" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="w-full flex items-center gap-4 p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all font-bold">
                        <FaSignOutAlt className="text-xl flex-shrink-0" />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-white capitalize tracking-tighter">{activeTab.replace('-', ' ')}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative p-2.5 text-slate-400 hover:text-blue-500 transition-all bg-slate-800/50 rounded-xl cursor-pointer">
                            <FaBell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div className="flex items-center gap-3 bg-slate-800/30 p-1.5 pr-4 rounded-xl border border-slate-800/50">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/10">
                                {user?.name ? user.name[0] : 'S'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-black text-white leading-none">{user?.name || 'Supplier'}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Verified Hub</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[#0f172a] custom-scrollbar">
                    {activeTab === 'dashboard' && <SupplierOverview stats={stats} orders={orders} />}
                    {activeTab === 'catalog' && <CatalogTab products={products} onAdd={() => setAddProductModal(true)} />}
                    {activeTab === 'orders' && <OrdersTab orders={orders} onStatusChange={handleOrderStatus} onDelete={handleDeleteOrder} onVerifyAddress={handleVerifyAddress} />}
                    {activeTab === 'logistics' && <LogisticsTab orders={orders.filter(o => o.status === 'ongoing')} trackingOrderId={trackingOrderId} setTrackingOrderId={setTrackingOrderId} startTracking={startTracking} stopTracking={stopTracking} currentLocation={location} />}
                    {activeTab === 'analytics' && <AnalyticsTab orders={orders} />}
                    {activeTab === 'profile' && <ProfileTab user={user} />}
                </main>
            </div>

            {addProductModal && <AddProductModal onClose={() => setAddProductModal(false)} onSave={handleAddProduct} />}
        </div>
    );
};

// --- Views & Sub-components ---

const SidebarLink = ({ icon, label, active, onClick, open, color, badge }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all relative group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
        <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>{icon}</span>
        {open && <span className="font-bold text-sm tracking-tight whitespace-nowrap">{label}</span>}
        {open && badge > 0 && <span className="ml-auto bg-white/20 text-white px-2 py-0.5 rounded-lg text-[10px] font-black">{badge}</span>}
    </button>
);

const SupplierOverview = ({ stats, orders }) => (
    <div className="space-y-10 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue}`} trend="+15%" icon={<FaRupeeSign />} color="blue" />
            <StatsCard title="Pending Fulfillment" value={stats.pendingOrders} trend="Attention Required" icon={<FaClipboardList />} color="orange" />
            <StatsCard title="Listed Assets" value={stats.activeProducts} trend="Global Catalog" icon={<FaBox />} color="emerald" />
            <StatsCard title="Vendor Network" value={stats.vendorPartners} trend="Active Partners" icon={<FaUsers />} color="indigo" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 p-10 shadow-xl">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-10">Fulfillment Activity</h3>
                <div className="h-80"><Line data={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], datasets: [{ label: 'Orders', data: [12, 19, 15, 25, 22, 30], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } } }} /></div>
            </div>
            <div className="bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 p-10 shadow-xl overflow-hidden h-fit">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-8">Recent Vendor Inquiries</h3>
                <div className="space-y-6">
                    {orders.slice(0, 4).map(o => (
                        <div key={o._id} className="flex justify-between items-center p-5 bg-slate-900/30 rounded-2xl border border-slate-800/50 group hover:bg-slate-900/50 transition-all cursor-pointer">
                            <div><p className="font-bold text-white text-sm">{o.vendor}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Ref #{o._id.substring(o._id.length - 8)}</p></div>
                            <FaChevronRight className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                    ))}
                    <button className="w-full py-4 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors border-t border-slate-800 mt-4">View Complete Stream</button>
                </div>
            </div>
        </div>
    </div>
);

const CatalogTab = ({ products, onAdd }) => (
    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-between items-center px-2">
            <div><h2 className="text-4xl font-black text-white  tracking-tighter">Distribution Catalog</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Manage assets available for vendor sourcing</p></div>
            <button onClick={onAdd} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3"><FaPlus /> Add New Asset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {products.map(p => (
                <div key={p._id || p.id} className="group bg-[#1e293b]/40 rounded-[2.5rem] p-8 border border-slate-800 hover:border-blue-500/30 transition-all shadow-xl hover:shadow-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-10"><div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner border border-slate-800"><FaBox /></div><div className="text-right"><span className="text-2xl font-black text-white  tracking-tighter">₹{p.price}</span><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">per {p.unit || 'kg'}</p></div></div>
                    <h4 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-8">{p.category}</p>
                    <div className="flex gap-3"><button className="flex-1 py-4 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Update Asset</button><button className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"><FaTrash /></button></div>
                </div>
            ))}
        </div>
    </div>
);

const OrdersTab = ({ orders, onStatusChange, onDelete, onVerifyAddress }) => (
    <div className="animate-in slide-in-from-right-8 duration-700 space-y-10">
        <div><h2 className="text-4xl font-black text-white  tracking-tighter">Purchase Stream</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Vendor resource requests awaiting fulfillment</p></div>
        <div className="bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
                <thead><tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-900/50"><th className="p-8">Batch ID</th><th className="p-8">Vendor Partner</th><th className="p-8">Delivery Address</th><th className="p-8">Resources</th><th className="p-8">Valuation</th><th className="p-8">Logistics Status</th><th className="p-8 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-800/50">
                    {orders.map(o => (
                        <tr key={o._id} className="group hover:bg-slate-800/20 transition-all">
                            <td className="p-8 font-mono text-xs text-blue-500 font-black tracking-widest">#{o._id.substring(o._id.length - 8)}</td>
                            <td className="p-8 font-black text-white tracking-tight">{o.vendor}</td>
                            <td className="p-8 text-xs text-slate-400 font-bold  max-w-[200px] truncate" title={o.address || 'Not Provided'}>
                                {o.address || 'Not Provided'}
                                {o.isAddressVerified && <span className="ml-2 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest">Verified</span>}
                            </td>
                            <td className="p-8 text-sm text-slate-300 font-bold">{o.items ? `${o.items.length} items` : 'Batch'}</td>
                            <td className="p-8 font-black text-white  text-lg">₹{o.totalAmount}</td>
                            <td className="p-8"><span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : o.status === 'ongoing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>{o.status === 'pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}{o.status === 'ongoing' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>}{o.status}</span></td>
                            <td className="p-8 flex items-center justify-end gap-3">
                                {o.status === 'pending' ? (
                                    o.isAddressVerified ? (
                                        <button onClick={() => onStatusChange(o._id, 'ongoing')} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-blue-500 shadow-lg shadow-blue-500/20">Start Delivery</button>
                                    ) : (
                                        <button onClick={() => onVerifyAddress(o._id)} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-amber-500 shadow-lg shadow-amber-500/20">Verify Address</button>
                                    )
                                ) : o.status === 'ongoing' ? (
                                    <button onClick={() => onStatusChange(o._id, 'completed')} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-500 shadow-lg shadow-emerald-500/20">Complete Order</button>
                                ) : (
                                    <span className="px-5 py-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Fulfilled</span>
                                )}
                                {(o.status === 'pending' || o.status === 'completed') && (
                                    <button onClick={() => onDelete(o._id)} className="w-9 h-9 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all ml-2" title="Delete Order">
                                        <FaTrash size={12} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const LogisticsTab = ({ orders, trackingOrderId, setTrackingOrderId, startTracking, stopTracking, currentLocation }) => {
    const activeDeliveries = orders.filter(o => o.status === 'ongoing');
    return (
        <div className="animate-in fade-in duration-700 space-y-10">
            <div className="flex justify-between items-center px-2">
                <div><h2 className="text-4xl font-black text-white  tracking-tighter">Live Logistics</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Manage real-time telemetry for active resource flows</p></div>
                {trackingOrderId && <button onClick={() => { stopTracking(); setTrackingOrderId(null); }} className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3">Kill Telemetry Stream</button>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-[650px]">
                <div className="bg-[#1e293b]/40 border border-slate-800 rounded-[3rem] p-10 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-black text-white  mb-10 text-center tracking-tighter">Active Assignments</h3>
                    <div className="space-y-6">
                        {activeDeliveries.map(o => (
                            <div key={o._id} className={`p-8 rounded-[2rem] border transition-all cursor-pointer ${trackingOrderId === o._id ? 'bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-slate-900/30 border-slate-800 hover:bg-slate-800/40'}`}>
                                <div className="flex justify-between items-start mb-6"><div><h4 className="font-black text-white text-lg tracking-tight">{o.vendor}</h4><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Batch #{o._id.substring(o._id.length - 8)}</p></div><div className={`w-3 h-3 rounded-full ${trackingOrderId === o._id ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div></div>
                                <button onClick={() => { setTrackingOrderId(o._id); startTracking('SUPPLIER_001'); }} disabled={trackingOrderId === o._id} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${trackingOrderId === o._id ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{trackingOrderId === o._id ? 'Telemetry Active' : 'Track GPS'}</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-[#1e293b]/40 border border-slate-800 rounded-[3rem] p-6 relative overflow-hidden shadow-2xl"><LiveMap center={currentLocation} markers={currentLocation ? [{ ...currentLocation, type: 'delivery', label: 'Fleet-01' }] : []} height="100%" zoom={15} /><div className="absolute top-10 left-10 bg-[#0f172a]/95 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl group transition-all hover:scale-105"><p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4 text-center">GPS Stream Lock</p><div className="flex items-center gap-6"><div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center text-3xl border border-blue-500/20"><FaMapMarkerAlt /></div><div><p className="text-lg font-black text-white  tracking-tighter">Signal Verified</p><p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">{currentLocation?.lat?.toFixed(6) || '0.000000'}, {currentLocation?.lng?.toFixed(6) || '0.000000'}</p></div></div></div></div>
            </div>
        </div>
    );
};

const AnalyticsTab = ({ orders }) => (
    <div className="space-y-10 animate-in fade-in duration-700">
        <div><h2 className="text-4xl font-black text-white  tracking-tighter">Hub Intelligence</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Strategic mapping of your distribution performance</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#1e293b]/40 rounded-[3rem] border border-slate-800 p-12 shadow-2xl">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-10 text-center">Revenue Stream Analysis</h3>
                <div className="h-80"><Bar data={{ labels: ['W1', 'W2', 'W3', 'W4', 'W5'], datasets: [{ label: 'Revenue', data: [45000, 62000, 58000, 75000, 98000], backgroundColor: '#3b82f6', borderRadius: 12 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { weight: 'bold' } } }, x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: 'bold' } } } } }} /></div>
            </div>
            <div className="bg-[#1e293b]/40 rounded-[3rem] border border-slate-800 p-12 shadow-2xl">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-10 text-center">Fulfillment Mix</h3>
                <div className="h-80 flex items-center justify-center"><Pie data={{ labels: ['Onions', 'Potatoes', 'Paneer', 'Others'], datasets: [{ data: [40, 30, 20, 10], backgroundColor: ['#3b82f6', '#818cf8', '#10b981', '#6366f1'], borderWidth: 0, hoverOffset: 20 }] }} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { weight: 'bold' }, padding: 30 } } } }} /></div>
            </div>
        </div>
    </div>
);

const ProfileTab = ({ user }) => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-left-8 duration-700">
        <h2 className="text-4xl font-black text-white  tracking-tighter mb-10">Hub Configuration</h2>
        <div className="bg-[#1e293b]/40 rounded-[3rem] border border-slate-800 p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16 pb-16 border-b border-slate-800/50">
                <div className="relative group"><div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-500/30 group-hover:scale-105 transition-transform duration-500">{user?.name ? user.name[0] : 'S'}</div><div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-[#1e293b] rounded-full shadow-lg"></div></div>
                <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-white tracking-tight">{user?.name || 'Supply Hub'}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">{user?.email || 'supplier@example.com'}</p>
                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4"><span className="px-8 py-3 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-lg">Verified Logistics Partner</span><span className="px-8 py-3 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg">Network Elite Tier</span></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <ProfileItem label="Legal Entity Name" value={user?.name} />
                <ProfileItem label="Registered Comm-Channel" value={user?.email} />
                <ProfileItem label="Logistics Hub Base" value="South Satara Distribution" />
                <ProfileItem label="Network Tier Level" value="ELITE LOGISTICS HUB" color="text-blue-500" />
            </div>
            <button className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all border border-slate-700 shadow-xl">Edit Hub Configuration</button>
        </div>
    </div>
);

const ProfileItem = ({ label, value, color = "text-white" }) => (
    <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label><div className={`bg-slate-900/50 border border-slate-800 p-5 rounded-2xl font-bold shadow-inner ${color}`}>{value}</div></div>
);

const StatsCard = ({ title, value, trend, icon, color }) => {
    const colors = {
        blue: 'from-blue-600 to-indigo-700 shadow-blue-500/20 text-blue-500',
        orange: 'from-orange-500 to-amber-600 shadow-orange-500/20 text-orange-500',
        emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-500',
        indigo: 'from-indigo-500 to-purple-600 shadow-indigo-500/20 text-indigo-500'
    };
    return (
        <div className="bg-[#1e293b]/40 rounded-[2.5rem] p-10 border border-slate-800 flex flex-col justify-between hover:bg-[#1e293b]/60 transition-all shadow-xl group hover:scale-[1.02] duration-300">
            <div className="flex justify-between items-start mb-8"><div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-500 ${colors[color].split(' ').pop()}`}>{icon}</div><span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl bg-slate-900/50 ${trend.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>{trend}</span></div>
            <div><p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">{title}</p><h3 className="text-4xl font-black text-white  tracking-tighter">{value}</h3></div>
        </div>
    );
};

const AddProductModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', category: '', price: '', unit: 'kg', description: '' });
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity" onClick={onClose}></div>
            <div className="relative bg-[#1e293b] border border-slate-700 rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                <h3 className="text-4xl font-black text-white  mb-10 tracking-tighter text-center">New Distribution Asset</h3>
                <div className="space-y-6">
                    <FormInput label="Resource Designation" placeholder="e.g. Premium Red Onions" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <FormInput label="Logistics Category" placeholder="e.g. Vegetables" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    <div className="flex gap-4">
                        <div className="flex-1"><FormInput label="Unit Valuation (₹)" placeholder="0" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                        <div className="w-1/3 space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Measure Unit</label>
                            <select className="w-full bg-slate-900/50 border border-slate-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                                <option value="kg">KG</option>
                                <option value="gram">Grams</option>
                                <option value="piece">Pieces</option>
                                <option value="box">Boxes</option>
                                <option value="dozen">Dozens</option>
                                <option value="liter">Liters</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={() => onSave(formData)} className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 mt-4">Authorize Listing</button>
                    <button onClick={onClose} className="w-full py-4 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Dismiss</button>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, placeholder, value, onChange, type="text" }) => (
    <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label><input type={type} className="w-full bg-slate-900/50 border border-slate-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner" placeholder={placeholder} value={value} onChange={onChange} /></div>
);

export default SupplierDashboard;