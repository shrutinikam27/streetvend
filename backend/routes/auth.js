const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// Mock users for testing when DB is not connected
const mockUsers = [];

// Register user
router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('userType').isIn(['vendor', 'supplier', 'admin']).withMessage('Invalid user type')
], async (req, res) => {
    console.log('Registration attempt:', req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, userType } = req.body;

        // Check if user already exists (try DB first, fallback to mock)
        let existingUser;
        if (mongoose.connection.readyState === 1) {
            // DB connected, use database
            existingUser = await User.findOne({ email });
        } else {
            // DB not connected, check mock users
            existingUser = mockUsers.find(u => u.email === email);
        }

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (try DB first, fallback to mock)
        let user;
        if (mongoose.connection.readyState === 1) {
            // DB connected, use database
            user = new User({
                name,
                email,
                password: hashedPassword,
                userType
            });
            await user.save();
        } else {
            // DB not connected, create mock user
            user = {
                _id: Date.now().toString(),
                name,
                email,
                password: hashedPassword,
                userType
            };
            mockUsers.push(user);
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    console.log('Login attempt for:', req.body.email);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Login validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user (ONLY if DB is fully connected)
        let user;
        if (mongoose.connection.readyState === 1) {
            console.log('Checking database for user...');
            user = await User.findOne({ email });
        } else {
            console.log('Database not connected, checking mock users...');
            user = mockUsers.find(u => u.email === email);
        }

        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found, comparing passwords...');
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Password match, generating token...');
        // Create JWT token
        if (!process.env.JWT_SECRET) {
            console.error('FATAL: JWT_SECRET is missing in environment variables!');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Login successful for:', email);
        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('SERVER LOGIN ERROR:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// @route   GET api/auth/suppliers
// @desc    Get all suppliers
// @access  Public
router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await User.find({ userType: 'supplier' }).select('-password');
        res.json(suppliers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
