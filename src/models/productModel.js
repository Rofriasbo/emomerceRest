const mongoose = require('mongoose');

const categories = require('./enums/categories');

const product = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, enum: Object.values(categories), default: 'NO_CATEGORY' },
    brand: String,
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: new Date },
    imgs: [String],
    product_key: { type: String, required: true }
});

module.exports = mongoose.model('Product', product);