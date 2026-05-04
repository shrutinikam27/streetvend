import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    FaLayerGroup, FaSearch, FaShoppingCart, FaBoxOpen, FaChartBar, FaUserCircle,
    FaBell, FaSignOutAlt, FaPlus, FaMinus, FaTrash, FaTruck, FaRupeeSign,
    FaChevronRight, FaFilter, FaArrowUp, FaArrowDown, FaBars, FaMapMarkerAlt
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import API_URL from '../../config';
import LiveMap from '../common/LiveMap';
import { useTracking } from '../../hooks/useTracking';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const { othersLocations } = useTracking(trackingOrderId, false);

    // Fetch Products & Orders
    const fetchData = async () => {
        try {
            const productsRes = await fetch(`${API_URL}/api/products`);
            const productsData = await productsRes.json();
            setProducts(productsData || []);

            if (user?.name) {
                const ordersRes = await fetch(`${API_URL}/api/orders?vendor=${encodeURIComponent(user.name)}`);
                const ordersData = await ordersRes.json();
                setOrders(ordersData.orders || []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item._id !== id));
    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        // Group cart by supplier
        const ordersBySupplier = {};
        cart.forEach(item => {
            const sId = item.supplierId || item.supplier?.id || item.supplier?._id || 'unknown';
            if (!ordersBySupplier[sId]) ordersBySupplier[sId] = { items: [], total: 0 };
            ordersBySupplier[sId].items.push({
                product: item.name,
                quantity: item.qty,
                price: item.price,
                total: item.price * item.qty
            });
            ordersBySupplier[sId].total += item.price * item.qty;
        });

        try {
            for (const [supplierId, orderData] of Object.entries(ordersBySupplier)) {
                await fetch(`${API_URL}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        vendor: user?.name || 'Vendor',
                        supplierId: supplierId === 'unknown' ? null : supplierId,
                        orderDate: new Date(),
                        deliveryDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                        address: deliveryAddress || 'Address not provided',
                        status: 'pending',
                        items: orderData.items,
                        totalAmount: orderData.total + 150 // Including logistics
                    })
                });
            }
            alert('Orders placed successfully!');
            setCart([]);
            fetchData();
            setActiveTab('orders');
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                alert('Order cancelled successfully!');
                fetchData();
            } else {
                alert('Failed to cancel order');
            }
        } catch (err) {
            console.error(err);
            alert('Network error while cancelling order');
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
            {/* Sidebar - hidden on mobile */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} hidden md:flex bg-[#1e293b] border-r border-slate-800 transition-all duration-300 flex-col z-50`}>
                <div className="p-6 flex items-center gap-4 border-b border-slate-800 h-20">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                        <FaShoppingCart className="text-white text-xl" />
                    </div>
                    {sidebarOpen && <h1 className="font-black text-xl tracking-tighter text-white whitespace-nowrap">StreetVend <span className="text-orange-500 text-[10px] uppercase tracking-widest block font-bold mt-[-4px]">Marketplace</span></h1>}
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                    <SidebarLink icon={<FaSearch />} label="Search Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} open={sidebarOpen} />
                    <SidebarLink icon={<FaShoppingCart />} label="Cart" active={activeTab === 'cart'} onClick={() => setActiveTab('cart')} open={sidebarOpen} badge={cart.length} />
                    <SidebarLink icon={<FaBoxOpen />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} open={sidebarOpen} />
                    <SidebarLink icon={<FaChartBar />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} open={sidebarOpen} />
                    <SidebarLink icon={<FaUserCircle />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} open={sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="w-full flex items-center gap-4 p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all font-bold">
                        <FaSignOutAlt className="text-xl flex-shrink-0" />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Navbar */}
                <header className="h-16 md:h-20 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 z-40">
                    <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg hidden md:block">
                            <FaBars className={sidebarOpen ? 'rotate-90' : ''} />
                        </button>
                        <h1 className="font-black text-base text-white md:hidden">StreetVend</h1>
                        <div className="relative max-w-md w-full hidden md:block">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" placeholder="Search resources, suppliers, batches..." className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-orange-500/50 transition-all text-sm" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative p-2 text-slate-400 hover:text-orange-500 transition-all bg-slate-800/50 rounded-xl cursor-pointer">
                            <FaBell size={16} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/30 p-1 pr-3 rounded-xl border border-slate-800/50">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-black text-white text-sm">
                                {user?.name ? user.name[0] : 'V'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-black text-white leading-none">{user?.name || 'Vendor'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 bg-[#0f172a] custom-scrollbar">
                    {activeTab === 'dashboard' && <DashboardOverview products={products} orders={orders} />}
                    {activeTab === 'products' && <ProductListing products={products} onAdd={addToCart} />}
                    {activeTab === 'cart' && <CartPage cart={cart} updateQty={updateQty} onRemove={removeFromCart} total={cartTotal} onCheckout={handleCheckout} address={deliveryAddress} setAddress={setDeliveryAddress} />}
                    {activeTab === 'orders' && <OrdersPage orders={orders} trackingOrderId={trackingOrderId} setTrackingOrderId={setTrackingOrderId} othersLocations={othersLocations} onDelete={handleDeleteOrder} />}
                    {activeTab === 'analytics' && <AnalyticsPage />}
                    {activeTab === 'profile' && <ProfilePage user={user} />}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e293b] border-t border-slate-800 flex md:hidden">
                {[
                    { icon: <FaSearch />, label: 'Shop', tab: 'products' },
                    { icon: <FaShoppingCart />, label: 'Cart', tab: 'cart', badge: cart.length },
                    { icon: <FaBoxOpen />, label: 'Orders', tab: 'orders' },
                    { icon: <FaChartBar />, label: 'Stats', tab: 'analytics' },
                    { icon: <FaUserCircle />, label: 'Profile', tab: 'profile' },
                ].map(item => (
                    <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`flex-1 flex flex-col items-center py-3 gap-1 relative transition-colors ${activeTab === item.tab ? 'text-orange-500' : 'text-slate-500'}`}>
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                        {item.badge > 0 && <span className="absolute top-2 right-1/4 w-4 h-4 bg-orange-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">{item.badge}</span>}
                    </button>
                ))}
                <button onClick={logout} className="flex-1 flex flex-col items-center py-3 gap-1 text-slate-500">
                    <span className="text-lg"><FaSignOutAlt /></span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Logout</span>
                </button>
            </nav>
        </div>
    );
};

// --- Sub-Components ---

const SidebarLink = ({ icon, label, active, onClick, open, badge }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all relative group ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
        <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-orange-400'}`}>{icon}</span>
        {open && <span className="font-bold text-sm tracking-tight whitespace-nowrap">{label}</span>}
        {open && badge > 0 && <span className="ml-auto bg-white/20 text-white px-2 py-0.5 rounded-lg text-[10px] font-black">{badge}</span>}
        {!open && badge > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full text-[10px] flex items-center justify-center font-black">{badge}</span>}
    </button>
);

const DashboardOverview = ({ products, orders }) => {
    const totalSpend = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return (
    <div className="space-y-10 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Spend" value={`₹${totalSpend}`} trend="Realtime" icon={<FaRupeeSign />} color="orange" />
            <StatsCard title="Active Orders" value={orders.length} trend="Realtime" icon={<FaTruck />} color="blue" />
            <StatsCard title="Supply Assets" value={products.length} trend="Market Live" icon={<FaBoxOpen />} color="emerald" />
            <StatsCard title="Network Rating" value="4.9" trend="Excellent" icon={<FaUserCircle />} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 p-8 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-white  tracking-tighter">Expenditure Flow</h3>
                    <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold outline-none"><option>Last 6 Months</option></select>
                </div>
                <div className="h-80"><Line data={{ labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Spend', data: [15000, 22000, 18000, 25000, 21000, 30000], borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)', fill: true, tension: 0.4 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } } }} /></div>
            </div>
            <div className="bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 p-8 shadow-xl">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-8">Recent Logistics</h3>
                <div className="space-y-6">
                    {orders.slice(0, 4).map(o => (
                        <div key={o._id} className="flex justify-between items-center p-4 bg-slate-900/30 rounded-2xl border border-slate-800/50 group hover:bg-slate-900/50 transition-all cursor-pointer">
                            <div><p className="font-bold text-white text-sm">{o.items ? `${o.items.length} items` : 'Sourcing Batch'}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{o.status}</p></div>
                            <FaChevronRight className="text-slate-600 group-hover:text-orange-500 transition-colors" />
                        </div>
                    ))}
                    <button className="w-full py-4 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors border-t border-slate-800 mt-4">View All Shipments</button>
                </div>
            </div>
        </div>
    </div>
    );
};

const ProductListing = ({ products, onAdd }) => (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div><h2 className="text-4xl font-black text-white  tracking-tighter">Marketplace</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Source premium assets from verified suppliers</p></div>
            <div className="flex gap-4 w-full md:w-auto"><button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700 flex items-center gap-2"><FaFilter /> Filters</button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(p => (
                <div key={p._id || p.id} className="group bg-[#1e293b]/40 rounded-[2.5rem] p-8 border border-slate-800 hover:border-orange-500/30 transition-all shadow-xl hover:shadow-orange-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] pointer-events-none group-hover:bg-orange-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-10"><div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-orange-500 text-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner border border-slate-800"><FaBoxOpen /></div><div className="text-right"><span className="text-2xl font-black text-white  tracking-tighter">₹{p.price}</span><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">per {p.unit || 'kg'}</p></div></div>
                    <h4 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-orange-500 transition-colors">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-8">{p.supplier?.name || 'Local Distribution'}</p>
                    <button onClick={() => { onAdd(p); alert(`${p.name} added to cart!`); }} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"><FaPlus /> Add to Cart</button>
                </div>
            ))}
        </div>
    </div>
);

const CartPage = ({ cart, updateQty, onRemove, total, onCheckout, address, setAddress }) => (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-6 md:mb-10">Sourcing Cart</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            <div className="lg:col-span-2 space-y-6">
                {cart.length === 0 ? (
                    <div className="bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 p-20 text-center flex flex-col items-center opacity-40"><FaShoppingCart size={64} className="mb-6" /><p className="font-bold text-xl uppercase tracking-widest">Cart is empty</p></div>
                ) : (
                    cart.map(item => (
                        <div key={item._id} className="flex flex-col sm:flex-row justify-between items-center p-8 bg-[#1e293b]/40 rounded-[2.5rem] border border-slate-800 group transition-all hover:bg-[#1e293b]/60 shadow-xl">
                            <div className="flex items-center gap-6 mb-4 sm:mb-0"><div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 text-2xl border border-slate-800"><FaBoxOpen /></div><div><h4 className="font-black text-white text-xl tracking-tight">{item.name}</h4><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.supplier?.name || 'Authorized Hub'}</p></div></div>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-4 bg-slate-900 rounded-xl p-2 border border-slate-800"><button onClick={() => updateQty(item._id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><FaMinus size={12} /></button><div className="flex flex-col items-center justify-center w-12"><span className="text-center font-black text-orange-500 leading-none">{item.qty}</span><span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.unit || 'kg'}</span></div><button onClick={() => updateQty(item._id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><FaPlus size={12} /></button></div>
                                <div className="text-right w-24"><p className="font-black text-white text-xl">₹{item.price * item.qty}</p></div>
                                <button onClick={() => onRemove(item._id)} className="p-3 text-slate-600 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-xl"><FaTrash /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="bg-[#1e293b] rounded-[2.5rem] border border-slate-800 p-10 h-fit shadow-2xl sticky top-28">
                <h3 className="text-2xl font-black text-white  mb-10 tracking-tighter">Settlement Summary</h3>
                
                <div className="mb-8">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Delivery Address (Verification)</label>
                    <textarea 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Enter full delivery address for identity verification..." 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm text-white outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all resize-none h-24"
                    />
                </div>

                <div className="space-y-6 mb-10 border-b border-slate-800 pb-8">
                    <div className="flex justify-between text-slate-400 font-bold text-sm"><span>Subtotal</span><span>₹{total}</span></div>
                    <div className="flex justify-between text-slate-400 font-bold text-sm"><span>Logistics Fee</span><span>₹150</span></div>
                    <div className="flex justify-between text-orange-500 font-black text-sm uppercase tracking-widest pt-4 border-t border-slate-800"><span>Net Payable</span><span className="text-3xl text-white  tracking-tighter">₹{total + (cart.length > 0 ? 150 : 0)}</span></div>
                </div>
                <button onClick={onCheckout} disabled={cart.length === 0 || !address.trim()} className="w-full py-6 bg-gradient-to-r from-orange-500 to-amber-600 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:active:scale-100">Complete Purchase Order</button>
            </div>
        </div>
    </div>
);

const OrdersPage = ({ orders, trackingOrderId, setTrackingOrderId, othersLocations, onDelete }) => {
    // Get the first location from the othersLocations object for the currently tracked order
    const locationValues = Object.values(othersLocations);
    const supplierLocation = locationValues.length > 0 ? locationValues[0] : null;

    return (
    <div className="animate-in slide-in-from-right-8 duration-700 space-y-10">
        <div><h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter">Purchase Stream</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Lifecycle of your active and historical acquisitions</p></div>
        
        {trackingOrderId && (
            <div className="bg-[#1e293b]/40 rounded-2xl md:rounded-[2.5rem] border border-slate-800 p-4 md:p-6 relative overflow-hidden shadow-2xl h-[320px] md:h-[400px]">
                <div className="absolute top-4 left-4 md:top-10 md:left-10 z-10 bg-[#0f172a]/95 backdrop-blur-xl border border-slate-800 p-4 md:p-8 rounded-xl md:rounded-[2rem] shadow-2xl">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-3 text-center">Live Delivery Tracker</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-orange-600/10 text-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl border border-orange-500/20"><FaMapMarkerAlt /></div>
                        <div>
                            <p className="text-sm md:text-lg font-black text-white tracking-tighter">Supplier En Route</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">{supplierLocation ? `${supplierLocation.lat.toFixed(4)}, ${supplierLocation.lng.toFixed(4)}` : 'Waiting for signal...'}</p>
                        </div>
                    </div>
                    <button onClick={() => setTrackingOrderId(null)} className="w-full mt-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Close Map</button>
                </div>
                <LiveMap center={supplierLocation} markers={supplierLocation ? [{ ...supplierLocation, type: 'delivery', label: 'Supplier Fleet' }] : []} height="100%" zoom={15} />
            </div>
        )}

        <div className="bg-[#1e293b]/40 rounded-2xl md:rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead><tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-900/50"><th className="p-8">Reference</th><th className="p-8">Timeline</th><th className="p-8">Allocation</th><th className="p-8">Valuation</th><th className="p-8">Logistics Status</th><th className="p-8 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-800/50">
                    {orders.map(o => (
                        <tr key={o._id} className="group hover:bg-slate-800/20 transition-all">
                            <td className="p-8 font-mono text-xs text-orange-500 font-black tracking-widest">{o._id.substring(o._id.length - 8)}</td>
                            <td className="p-8 text-xs text-slate-400 font-bold ">{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td className="p-8 font-black text-white tracking-tight">{o.items ? `${o.items.length} items` : 'Batch'}</td>
                            <td className="p-8 font-black text-white  text-lg">₹{o.totalAmount}</td>
                            <td className="p-8"><span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : o.status === 'ongoing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>{o.status === 'pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}{o.status === 'ongoing' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>}{o.status}</span></td>
                            <td className="p-8 flex items-center justify-end gap-3">
                                {o.status === 'ongoing' ? (
                                    <button onClick={() => setTrackingOrderId(o._id)} disabled={trackingOrderId === o._id} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${trackingOrderId === o._id ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white border border-blue-500/20'}`}>{trackingOrderId === o._id ? 'Tracking Active' : 'Track Order'}</button>
                                ) : o.status === 'pending' ? (
                                    <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border ${o.isAddressVerified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                        {o.isAddressVerified ? 'Address Verified' : 'Awaiting Dispatch'}
                                    </span>
                                ) : (
                                    <span className="px-5 py-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Delivered</span>
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
    </div>
    );
};

const AnalyticsPage = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
        <div><h2 className="text-4xl font-black text-white  tracking-tighter">Business Analytics</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Statistical mapping of your sourcing performance</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#1e293b]/40 rounded-[3rem] border border-slate-800 p-10 shadow-2xl">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-10 text-center">Category Distribution</h3>
                <div className="h-80 flex items-center justify-center"><Pie data={{ labels: ['Vegetables', 'Dairy', 'Grains', 'Others'], datasets: [{ data: [45, 25, 20, 10], backgroundColor: ['#f97316', '#3b82f6', '#10b981', '#6366f1'], borderWidth: 0, hoverOffset: 20 }] }} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { weight: 'bold' }, padding: 20 } } } }} /></div>
            </div>
            <div className="bg-[#1e293b]/40 rounded-[3rem] border border-slate-800 p-10 shadow-2xl">
                <h3 className="text-xl font-black text-white  tracking-tighter mb-10 text-center">Supply Chain Efficiency</h3>
                <div className="h-80"><Bar data={{ labels: ['W1', 'W2', 'W3', 'W4', 'W5'], datasets: [{ label: 'Efficiency', data: [88, 92, 85, 95, 98], backgroundColor: '#3b82f6', borderRadius: 8 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 80, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } } }} /></div>
            </div>
        </div>
    </div>
);

const ProfilePage = ({ user }) => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-left-8 duration-700">
        <h2 className="text-4xl font-black text-white  tracking-tighter mb-10">Account configuration</h2>
        <div className="bg-[#1e293b]/40 rounded-[3rem] border border-slate-800 p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16 pb-16 border-b border-slate-800/50">
                <div className="relative group"><div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-orange-500/30 group-hover:scale-105 transition-transform duration-500">{user?.name ? user.name[0] : 'V'}</div><div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-[#1e293b] rounded-full shadow-lg"></div></div>
                <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-white tracking-tight">{user?.name || 'Street Vendor'}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">{user?.email || 'vendor@example.com'}</p>
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4"><span className="px-6 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">Verified Identity</span><span className="px-6 py-2 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Premium Tier</span></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label><div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white font-bold">{user?.name}</div></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registered Channel</label><div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white font-bold">{user?.email}</div></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logistics Hub</label><div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white font-bold">Satara Central Plaza</div></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Tier</label><div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-orange-500 font-black">PREMIUM ELITE</div></div>
            </div>
            <button className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-16 transition-all border border-slate-700 shadow-xl">Edit Configuration</button>
        </div>
    </div>
);

const StatsCard = ({ title, value, trend, icon, color }) => {
    const colors = {
        orange: 'from-orange-500 to-amber-600 shadow-orange-500/20 text-orange-500',
        blue: 'from-blue-500 to-indigo-600 shadow-blue-500/20 text-blue-500',
        emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-500',
        amber: 'from-amber-500 to-yellow-600 shadow-amber-500/20 text-amber-500'
    };
    return (
        <div className="bg-[#1e293b]/40 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-between hover:bg-[#1e293b]/60 transition-all shadow-xl group">
            <div className="flex justify-between items-start mb-6"><div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-500 ${colors[color].split(' ').pop()}`}>{icon}</div><span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-900/50 ${trend.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>{trend}</span></div>
            <div><p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{title}</p><h3 className="text-3xl font-black text-white  tracking-tighter">{value}</h3></div>
        </div>
    );
};

export default VendorDashboard;