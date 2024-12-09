const Cart = require('../models/cartModel');

exports.createCart = async (req, res) => {
    console.log(req.body); // Esto te ayudará a depurar
    try {
        const { userId, items, subTotal, iva, total } = req.body;
        const cart = new Cart({ user: userId, items, subTotal, iva, total });
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.closeCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('user').populate('items.productId');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('user').populate('items.productId');
        res.json(carts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};