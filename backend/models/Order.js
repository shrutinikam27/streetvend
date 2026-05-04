const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    vendor: {
        type: String,
        required: true
    },
    supplierId: {
        type: String,
        required: false
    },
    orderDate: {
        type: Date,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    isAddressVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'ongoing', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
