// src/controllers/paymentController.js
const { createPaymentIntent } = require('../api/stripeService');

exports.processPayment = async (req, res) => {
    const { total, currency, paymentMethodDetails } = req.body; // Asegúrate de incluir paymentMethodDetails

    if (!paymentMethodDetails || !paymentMethodDetails.card) {
        return res.status(400).json({ success: false, error: 'paymentMethodDetails is required' });
    }

    try {
        // Crear un PaymentIntent
        const paymentIntent = await createPaymentIntent(total, currency, paymentMethodDetails.card); // Asegúrate de pasar paymentMethodDetails

        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};