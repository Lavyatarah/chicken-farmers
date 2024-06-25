// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chickenfarmers', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
const farmerRoutes = require('./routes/farmer');
const chickenRoutes = require('./routes/chicken');
// Add other routes as needed

app.use('/api/farmers', farmerRoutes);
app.use('/api/chickens', chickenRoutes);
// Add other route middleware as needed

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});