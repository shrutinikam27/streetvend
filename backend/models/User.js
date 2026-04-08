const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['vendor', 'supplier', 'admin']
    },
    // Supplier specific fields
    businessName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    deliveryTime: {
        type: String,
        default: '1-3 hours'
    },
    minOrder: {
        type: String,
        default: '₹1,000'
    },
    profileImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
