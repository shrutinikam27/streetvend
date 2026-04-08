const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminCheck } = require('../middleware/auth');

// @route   GET api/admin/stats
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/stats', [auth, adminCheck], async (req, res) => {
    try {
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', [auth, adminCheck], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', [auth, adminCheck], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) {
        console.error(err.message);
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
        
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', [auth, adminCheck], async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
