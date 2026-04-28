const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For production restrict this to your frontend URL
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({
    origin: '*',
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
    }
};

connectDB();

// ===== Socket.io Logic =====
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a specific order tracking room
    socket.on('join-order', (orderId) => {
        socket.join(`order-${orderId}`);
        console.log(`Socket ${socket.id} joined tracking room: order-${orderId}`);
    });

    // Handle incoming location updates from suppliers
    socket.on('update-location', (data) => {
        const { orderId, location, supplierId } = data;
        console.log(`Location update for order ${orderId}:`, location);
        
        // Broadcast to everyone in that order room (usually the customer and admin)
        io.to(`order-${orderId}`).emit('location-updated', {
            orderId,
            location,
            supplierId,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));

// Test Route
app.get('/', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    
    res.json({ 
        message: 'StreetVend Backend API with Real-time Tracking is running 🚀',
        database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
        readyState: mongoose.connection.readyState,
        dbError: dbError,
        environment: process.env.NODE_ENV || 'development'
    });
});

// ===== Server =====
const PORT = process.env.PORT || 5007;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

