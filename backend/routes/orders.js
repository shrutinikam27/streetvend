const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Get all orders (optionally filtered by vendor or supplierId)
router.get('/', async (req, res) => {
    try {
        const { vendor, supplierId } = req.query;
        let query = {};
        if (vendor) query.vendor = vendor;
        if (supplierId) query.supplierId = supplierId;
        
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { vendor, supplierId, orderDate, deliveryDate, notes, address, status, items, totalAmount } = req.body;

        const order = new Order({
            vendor,
            supplierId,
            orderDate,
            deliveryDate,
            notes,
            address,
            status,
            items,
            totalAmount
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/:id', async (req, res) => {
    try {
        const { status, isAddressVerified } = req.body;
        
        const updateFields = {};
        if (status) updateFields.status = status;
        if (isAddressVerified !== undefined) updateFields.isAddressVerified = isAddressVerified;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
