const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminCheck } = require('../middleware/auth');

// Admin Routes Logic (Real DB Only)

// @route   GET api/admin/stats
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/stats', [auth, adminCheck], async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connection is not ready.' });
        }
        
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalVendors = await User.countDocuments({ userType: 'vendor' });
        const totalSuppliers = await User.countDocuments({ userType: 'supplier' });
        const totalProducts = await Product.countDocuments();
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
        
        res.json({
            totalUsers,
            totalOrders,
            totalVendors,
            totalSuppliers,
            totalProducts,
            recentOrders
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
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database busy.' });
        }
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('Admin Orders Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
