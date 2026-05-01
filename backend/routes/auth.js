const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// Authentication Routes

// Helper to ensure DB is connected
const ensureDB = async () => {
    if (mongoose.connection.readyState === 1) return true;
    
    // If it's fully disconnected, manually trigger connection
    if (mongoose.connection.readyState === 0) {
        console.log('Database disconnected, actively connecting...');
        try {
            await mongoose.connect(process.env.MONGO_URI, { 
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
            });
            return true;
        } catch (e) {
            console.error('Failed to connect to database in ensureDB:', e);
            return false;
        }
    }
    
    console.log('Waiting for database connection...');
    // Wait for up to 10 seconds for the connection to be established (if readyState is 2 - connecting)
    for (let i = 0; i < 20; i++) {
        if (mongoose.connection.readyState === 1) return true;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return mongoose.connection.readyState === 1;
};

// Register user
router.get('/seed-admin', async (req, res) => {
    try {
        if (!(await ensureDB())) {
            return res.status(503).json({ message: 'Database connection is still initializing. Please refresh in a moment.' });
        }
        const adminEmail = 'admin@test.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            return res.json({ message: 'Admin user already exists', user: adminEmail });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            userType: 'admin'
        });

        await admin.save();
        res.status(201).json({ 
            message: 'Admin user seeded successfully!', 
            email: adminEmail,
            password: 'admin123'
        });
    } catch (error) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
});

router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('userType').isIn(['vendor', 'supplier', 'admin']).withMessage('Invalid user type')
], async (req, res) => {
    console.log('Registration attempt:', req.body.email, `(${req.body.userType})`);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Registration validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, userType } = req.body;

        // Ensure DB is ready
        if (!(await ensureDB())) {
            return res.status(503).json({ message: 'Database is connecting. Please try again in a few seconds.' });
        }
        
        console.log('Checking database for existing user...');
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        console.log('Saving new user to database...');
        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType
        });
        await user.save();

        console.log('Generating token for new user...');
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Registration successful for:', email);
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
        console.error('SERVER REGISTRATION ERROR:', error);
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

        // Ensure DB is ready
        if (!(await ensureDB())) {
            return res.status(503).json({ message: 'Database is connecting. Please try again in a few seconds.' });
        }

        console.log('Checking database for user...');
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'User not found. Please check your email or sign up.' });
        }

        console.log('User found, comparing passwords...');
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ message: 'Invalid password. Please try again.' });
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

// Forgot password route (Mock)
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    console.log('Forgot password attempt for:', req.body.email);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        if (!(await ensureDB())) {
            return res.status(503).json({ message: 'Database is connecting. Please try again.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // For security, it's often better to say "If email exists, a link was sent", 
            // but for user feedback in this app, we'll give a direct error:
            return res.status(400).json({ message: 'No account found with that email address.' });
        }

        // Mock email sending
        console.log(`Mock email sent to ${email} for password reset.`);

        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('SERVER FORGOT PASSWORD ERROR:', error);
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
