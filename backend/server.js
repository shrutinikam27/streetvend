const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // For production you can restrict to the specific Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ===== MongoDB Connection =====
const mongoURI = process.env.MONGO_URI;
let dbError = null;

if (!mongoURI) {
    console.error("❌ MONGO_URI not found in environment variables");
    // On Vercel, we might not want to exit immediately to allow the status route to show the error
}

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) return;
        
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI, { 
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log('✅ MongoDB connected');
        dbError = null;
    } catch (err) {
        dbError = err.message;
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️  Server will continue running in mock mode if DB connection fails');
    }
};

// Initial connection attempt
connectDB();

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));

// Test Route
app.get('/', async (req, res) => {
    // Try to reconnect if disconnected
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    
    res.json({ 
        message: 'StreetVend Backend API is running 🚀',
        database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
        readyState: mongoose.connection.readyState,
        dbError: dbError,
        environment: process.env.NODE_ENV || 'development'
    });
});

// ===== Server =====
const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
