// src/api/stripeService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency, paymentMethodDetails) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Monto en centavos
            currency: currency, // Moneda (por ejemplo, 'usd')
            payment_method_data: {
                type: 'card',
                card: paymentMethodDetails, // Detalles de la tarjeta
            },
            confirm: true, // Confirmar el pago automáticamente
            return_url: 'https://www.youtube.com/', // Reemplaza con tu URL de retorno
        });
        return paymentIntent; // Retorna el PaymentIntent creado
    } catch (error) {
        throw new Error(`Error al crear PaymentIntent: ${error.message}`);
    }
};

module.exports = {
    createPaymentIntent
};