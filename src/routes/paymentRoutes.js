// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');

// Ruta para procesar el pago
router.post('/payment', processPayment);

module.exports = router;