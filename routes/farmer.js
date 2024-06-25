const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const router = express.Router();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Register farmer
router.post('/register', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newFarmer = new Farmer({ name, email, passwordHash });
        await newFarmer.save();

        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login farmer
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const farmer = await Farmer.findOne({ email });
        if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

        const isMatch = await bcrypt.compare(password, farmer.passwordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: farmer._id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. Token required' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.farmerId = decoded.id;
        next();
    });
}

// Get farmer profile
router.get('/profile', verifyToken, async(req, res) => {
    try {
        const farmer = await Farmer.findById(req.farmerId).select('-passwordHash');
        res.json(farmer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;