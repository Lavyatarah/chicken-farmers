const mongoose = require('mongoose');

const chickenSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    quantity: { type: Number, required: true },
    quality: { type: String, required: true },
    price: { type: Number, required: true },
    availableDate: { type: Date, required: true },
});

module.exports = mongoose.model('Chicken', chickenSchema);