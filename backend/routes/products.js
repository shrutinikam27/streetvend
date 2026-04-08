const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminCheck } = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('supplier', 'name email');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/products
// @desc    Create a product (Admin only)
// @access  Private/Admin
router.post('/', [auth, adminCheck], async (req, res) => {
    try {
        const { name, category, price, description, supplierId } = req.body;

        const newProduct = new Product({
            name,
            category,
            price,
            description,
            supplier: supplierId
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, adminCheck], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
