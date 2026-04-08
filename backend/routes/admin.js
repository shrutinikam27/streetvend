const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminCheck } = require('../middleware/auth');

// Mock lists for administrative fallback
const mockOrders = [
    { _id: 'ord1', vendor: 'Satara Chaat', totalAmount: 1560, status: 'Completed', deliveryDate: new Date() },
    { _id: 'ord2', vendor: 'Highway Treats', totalAmount: 2450, status: 'Pending', deliveryDate: new Date() },
    { _id: 'ord3', vendor: 'Karad Sweets', totalAmount: 890, status: 'Processing', deliveryDate: new Date() }
];

const mockProducts = [
    { _id: 'prod1', name: 'Fresh Potatoes', category: 'Vegetables', price: 40, description: 'Direct from farms' },
    { _id: 'prod2', name: 'Alfonso Mangoes', category: 'Fruits', price: 600, description: 'Grade A Ratnagiri' }
];

// Re-using mockUsers from auth for consistency if needed, but defining basics here
const fallbackUsers = [
    { _id: 'user1', name: 'Admin User', email: 'admin@test.com', userType: 'admin', createdAt: new Date() },
    { _id: 'user2', name: 'Raj Vendors', email: 'raj@vendor.com', userType: 'vendor', createdAt: new Date() },
    { _id: 'user3', name: 'Agro Fresh', email: 'agro@supplier.com', userType: 'supplier', createdAt: new Date() }
];

// @route   GET api/admin/stats
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/stats', [auth, adminCheck], async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const totalUsers = await User.countDocuments();
            const totalOrders = await Order.countDocuments();
            const totalVendors = await User.countDocuments({ userType: 'vendor' });
            const totalSuppliers = await User.countDocuments({ userType: 'supplier' });
            const totalProducts = await Product.countDocuments();
            const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
            
            return res.json({
                totalUsers,
                totalOrders,
                totalVendors,
                totalSuppliers,
                totalProducts,
                recentOrders
            });
        }
        
        // Fallback to mock stats
        res.json({
            totalUsers: fallbackUsers.length,
            totalOrders: mockOrders.length,
            totalVendors: fallbackUsers.filter(u => u.userType === 'vendor').length,
            totalSuppliers: fallbackUsers.filter(u => u.userType === 'supplier').length,
            totalProducts: mockProducts.length,
            recentOrders: mockOrders
        });
    } catch (err) {
        console.error('Admin Stats Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', [auth, adminCheck], async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const users = await User.find().select('-password').sort({ createdAt: -1 });
            return res.json(users);
        }
        res.json(fallbackUsers);
    } catch (err) {
        console.error('Admin Users Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', [auth, adminCheck], async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await User.findByIdAndDelete(req.params.id);
            return res.json({ message: 'User removed' });
        }
        res.json({ message: 'User removed (Mock Mode)' });
    } catch (err) {
        console.error('Admin Delete User Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id
// @desc    Update a user
// @access  Private/Admin
router.put('/users/:id', [auth, adminCheck], async (req, res) => {
    try {
        const { name, businessName, phone, city, address, rating, deliveryTime, minOrder, profileImage } = req.body;
        const userFields = { name, businessName, phone, city, address, rating, deliveryTime, minOrder, profileImage };
        
        if (mongoose.connection.readyState === 1) {
            let user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: userFields },
                { new: true }
            ).select('-password');
            return res.json(user);
        }
        res.json({ ...userFields, _id: req.params.id, message: 'User updated (Mock Mode)' });
    } catch (err) {
        console.error('Admin Update User Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', [auth, adminCheck], async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const orders = await Order.find().sort({ createdAt: -1 });
            return res.json(orders);
        }
        res.json(mockOrders);
    } catch (err) {
        console.error('Admin Orders Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
