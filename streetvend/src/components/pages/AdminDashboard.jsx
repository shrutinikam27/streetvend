import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalVendors: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingProducts, setViewingProducts] = useState(null);
  const [viewingTracking, setViewingTracking] = useState(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    supplierId: ''
  });

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-auth-token': token };

      const statsRes = await fetch('http://127.0.0.1:5007/api/admin/stats', { headers });
      const statsData = await statsRes.json();
      setStats(statsData);

      const usersRes = await fetch('http://127.0.0.1:5007/api/admin/users', { headers });
      const usersData = await usersRes.json();
      setUsers(usersData);

      const ordersRes = await fetch('http://127.0.0.1:5007/api/admin/orders', { headers });
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const productsRes = await fetch('http://127.0.0.1:5007/api/products');
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5007/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token }
        });
        if (response.ok) {
          setUsers(users.filter(u => u._id !== id));
          alert('User deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5007/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newProduct)
      });
      if (response.ok) {
        const product = await response.json();
        setProducts([...products, product]);
        setNewProduct({ name: '', category: '', price: '', description: '', supplierId: '' });
        alert('Product added successfully');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateSupplierDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5007/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editingUser)
      });
      if (response.ok) {
        setUsers(users.map(u => u._id === editingUser._id ? editingUser : u));
        setEditingUser(null);
        alert('Supplier details updated successfully');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5007/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token }
        });
        if (response.ok) {
          setProducts(products.filter(p => p._id !== id));
          alert('Product deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl hidden md:block">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-orange-600">Admin Portal</h1>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'overview' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'users' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-medium">Users</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <span className="font-medium">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'products' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span className="font-medium">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'suppliers' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span className="font-medium">Suppliers</span>
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'tracking' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-medium">Live Tracking</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-gray-600 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-medium">Back to Home</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'users' ? 'User Management' : activeTab === 'orders' ? 'Order Management' : activeTab === 'products' ? 'Product Management' : activeTab === 'suppliers' ? 'Supplier Management' : 'Live Delivery Tracking'}
          </h2>
        </header>

        <main className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
                  <div className="mt-2 text-xs text-orange-600 font-medium">↑ 12% from last month</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
                  <div className="mt-2 text-xs text-orange-600 font-medium">↑ 5% from last month</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-500 mb-1">Vendors</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalVendors}</h3>
                  <div className="mt-2 text-xs text-orange-600 font-medium">+2 new today</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-500 mb-1">Suppliers</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalSuppliers}</h3>
                  <div className="mt-2 text-xs text-orange-600 font-medium">Stable</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalProducts}</h3>
                  <div className="mt-2 text-xs text-orange-600 font-medium">Live on platform</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="font-bold text-gray-800">Recent Orders</h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Vendor</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id.slice(-5)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.vendor}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalAmount}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
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

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 mb-6">User Distribution</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Vendors</span>
                        <span className="text-sm font-bold text-gray-900">{Math.round((stats.totalVendors / stats.totalUsers) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(stats.totalVendors / stats.totalUsers) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Suppliers</span>
                        <span className="text-sm font-bold text-gray-900">{Math.round((stats.totalSuppliers / stats.totalUsers) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-orange-300 h-2.5 rounded-full" style={{ width: `${(stats.totalSuppliers / stats.totalUsers) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 bg-orange-50 p-6 rounded-2xl border border-orange-100 relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="text-orange-900 font-bold mb-2">Admin Tip</h4>
                      <p className="text-orange-800 text-sm">Regularly check for pending supplier applications to maintain platform quality.</p>
                    </div>
                    <svg className="absolute -right-4 -bottom-4 w-24 h-24 text-orange-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs mr-3">
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.userType === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.userType === 'supplier' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                          }`}>
                          {u.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        {u.userType === 'supplier' && (
                          <button
                            onClick={() => setEditingUser(u)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={u.userType === 'admin'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Edit Supplier Modal */}
              {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b flex justify-between items-center bg-orange-600 text-white rounded-t-2xl">
                      <h3 className="text-xl font-bold">Edit Supplier Details</h3>
                      <button onClick={() => setEditingUser(null)} className="hover:text-orange-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <form onSubmit={updateSupplierDetails} className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.businessName || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, businessName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                            value={editingUser.email}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.phone || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.city || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                          <textarea
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            rows="2"
                            value={editingUser.address || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.rating || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, rating: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.deliveryTime || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, deliveryTime: e.target.value })}
                            placeholder="e.g. 1-2 hours"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min. Order Amount</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                            value={editingUser.minOrder || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, minOrder: e.target.value })}
                            placeholder="e.g. ₹1,000"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Delivery Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">#{o._id.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{o.vendor}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${o.totalAmount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.deliveryDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            o.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-orange-100 text-orange-700'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              {/* Add Product Form */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Fresh Tomatoes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Spices">Spices</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Grains">Grains</option>
                      <option value="Meat">Meat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Brief description of the product"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Supplier</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      value={newProduct.supplierId}
                      onChange={(e) => setNewProduct({ ...newProduct, supplierId: e.target.value })}
                    >
                      <option value="">Select Supplier</option>
                      {users.filter(u => u.userType === 'supplier').map(s => (
                        <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>

              {/* Products List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Supplier</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.description}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{p.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.supplier?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'suppliers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Active Suppliers</h3>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                  {users.filter(u => u.userType === 'supplier').length} Total
                </span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Business Details</th>
                    <th className="px-6 py-4">Location & Contact</th>
                    <th className="px-6 py-4">Delivery & Min. Order</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.filter(u => u.userType === 'supplier').map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{s.businessName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Prop: {s.name}</div>
                        <div className="text-xs text-orange-600 font-medium">{s.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{s.city || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{s.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{s.deliveryTime || '1-3 hours'}</div>
                        <div className="text-xs text-gray-500">Min: {s.minOrder || '₹1,000'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-orange-500 font-bold">
                          <span>{s.rating || 4.5}</span>
                          <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => setViewingProducts(s)}
                          className="text-orange-500 hover:text-orange-700 transition-colors"
                          title="View Products"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button
                          onClick={() => setEditingUser(s)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit Supplier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        </button>
                        <button
                          onClick={() => deleteUser(s._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Supplier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Real-Time Delivery tracking</h2>
                  <p className="text-gray-500 mt-1">Monitoring {stats.recentOrders.length || 3} active shipments across the city</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-bold uppercase tracking-wider">Live System Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[650px]">
                {/* Map Area */}
                <div className="lg:col-span-2 relative bg-gray-100 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                  {/* Fake Map Background using a beautiful gradient pattern */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                  {/* Map UI Elements */}
                  <div className="absolute top-6 left-6 z-10 space-y-2">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Current View</p>
                        <p className="text-sm font-bold text-gray-800">Satara Smart Logistics Hub</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Pins - Use real data or fallback to mock */}
                  {(stats.recentOrders.length > 0 ? stats.recentOrders : [
                    { _id: 'mock1', status: 'Near Powai Naka', customerName: 'Satara Chaat' },
                    { _id: 'mock2', status: 'In Transit - Wai', customerName: 'Highway Treats' },
                    { _id: 'mock3', status: 'Delivered - Karad', customerName: 'Karad Sweets' }
                  ]).map((order, idx) => (
                    <div
                      key={order._id || idx}
                      className={`absolute transition-all duration-1000 ${idx === 0 ? 'top-[40%] left-[30%]' : idx === 1 ? 'top-[60%] left-[50%]' : 'top-[25%] left-[65%]'} cursor-pointer group hover:z-20`}
                      onClick={() => setActiveTrackingOrder(order)}
                    >
                      <div className={`relative ${activeTrackingOrder?._id === order._id ? 'scale-125' : 'scale-100'} transition-transform`}>
                        <div className="absolute -inset-4 bg-orange-500/20 rounded-full animate-ping"></div>
                        <div className="relative bg-white p-1.5 rounded-full shadow-xl border-2 border-orange-500">
                          <div className="bg-orange-500 p-2 rounded-full text-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-gray-900 text-white p-3 rounded-2xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none text-center shadow-2xl">
                          <p className="text-orange-400 mb-1">Order: #{order._id?.slice(-5) || 'TRK-' + (idx + 1)}</p>
                          <p className="text-[12px]">{order.status || 'SHIPPED'}</p>
                          <p className="text-gray-400 mt-1 uppercase tracking-widest text-[8px]">Agent: Rajesh K.</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* User Center Point (Simulated) */}
                  <div className="absolute bottom-6 right-6 z-10 flex space-x-2">
                    <button className="bg-white p-3 rounded-2xl shadow-lg hover:bg-gray-50 transition-colors text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
                    <button className="bg-white p-3 rounded-2xl shadow-lg hover:bg-gray-50 transition-colors text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg></button>
                  </div>
                </div>

                {/* Tracking Details Sidebar */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Active Deliveries</h3>
                    <p className="text-sm text-gray-500 mt-1">Real-time GPS Monitoring</p>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="divide-y divide-gray-50">
                      {(stats.recentOrders.length > 0 ? stats.recentOrders : [
                        { _id: 'mock1', status: 'Near Powai Naka', customerName: 'Satara Chaat' },
                        { _id: 'mock2', status: 'In Transit - ', customerName: 'Highway Treats' },
                        { _id: 'mock3', status: 'Delivered - Karad', customerName: 'Karad Sweets' }
                      ]).map((order, idx) => (
                        <div
                          key={order._id || idx}
                          className={`p-6 transition-all cursor-pointer ${activeTrackingOrder?._id === order._id ? 'bg-orange-50 border-l-4 border-orange-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                          onClick={() => setActiveTrackingOrder(order)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm font-bold text-gray-900">Order #{order._id?.slice(-5) || 'TRK-' + (idx + 1)}</p>
                              <p className="text-xs text-gray-500">Status: <span className="text-orange-600 font-bold">{order.status || 'Active'}</span></p>
                            </div>
                            <span className="px-3 py-1 bg-white text-orange-600 text-[10px] font-black rounded-full border border-orange-200">
                              {idx === 0 ? '75%' : idx === 1 ? '45%' : '15%'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: idx === 0 ? '75%' : idx === 1 ? '45%' : '15%' }}></div>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1.5 uppercase font-bold tracking-widest flex justify-between">
                                <span>Est: 12 mins</span>
                                <span>3.2 km left</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeTrackingOrder && (
                    <div className="p-6 bg-gray-900 text-white rounded-t-3xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-100 font-bold uppercase tracking-widest opacity-60">Fleet Agent</p>
                          <h4 className="text-lg font-black tracking-tight">{activeTrackingOrder.driverName || 'Rajesh Kumar'}</h4>
                        </div>
                      </div>
                      <button className="w-full bg-white text-gray-900 py-3 rounded-2xl font-black text-sm hover:bg-orange-50 transition-all flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                        <span>Contact Agent</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>




      {/* View Products Modal */}
      {viewingProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex justify-between items-center">
              {(() => {
                const supplierProducts = products.filter(p => {
                  const pSupplierId = p.supplier?._id || p.supplier;
                  return pSupplierId && String(pSupplierId) === String(viewingProducts._id);
                });
                return (
                  <>
                    <div>
                      <h3 className="text-2xl font-bold">{viewingProducts.businessName || viewingProducts.name}</h3>
                      <p className="opacity-90">{supplierProducts.length} Products in Catalog</p>
                    </div>
                  </>
                );
              })()}
              <button
                onClick={() => setViewingProducts(null)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {(() => {
                const supplierProducts = products.filter(p => {
                  const pSupplierId = p.supplier?._id || p.supplier;
                  return pSupplierId && String(pSupplierId) === String(viewingProducts._id);
                });
                return supplierProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {supplierProducts.map(product => (
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
                );
              })()}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setViewingProducts(null)}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
