const express = require('express');
const Chicken = require('../models/Chicken');
const router = express.Router();

// Middleware to verify token (same as in farmer.js)
const verifyToken = require('./farmer').verifyToken;

// Add new chicken listing
router.post('/', verifyToken, async(req, res) => {
    try {
        const { quantity, quality, price, availableDate } = req.body;
        const newChicken = new Chicken({
            farmer: req.farmerId,
            quantity,
            quality,
            price,
            availableDate,
        });

        await newChicken.save();
        res.status(201).json(newChicken);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all chicken listings
router.get('/', async(req, res) => {
    try {
        const chickens = await Chicken.find().populate('farmer', 'name email');
        res.json(chickens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get chickens by farmer
router.get('/farmer', verifyToken, async(req, res) => {
    try {
        const chickens = await Chicken.find({ farmer: req.farmerId });
        res.json(chickens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;