const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ MONGO_URI not found in .env file");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        // Don't exit process, just log the error
        console.log('⚠️  Server will continue running without database connection');
    });

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'StreetVend Backend API is running 🚀' });
});

// ===== Server =====
const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
