const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Asegúrate de tener la clave secreta en tu archivo .env

// Función para crear un PaymentMethod
async function createPaymentMethod() {
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: '4242 4242 4242 4242', // Número de tarjeta de prueba
            exp_month: 12, // Mes de expiración
            exp_year: 2025, // Año de expiración
            cvc: '123', // CVC
        },
    });

    return paymentMethod.id; // Retorna el ID del PaymentMethod
}

// Función para procesar el pago
exports.processPayment = async (req, res) => {
    const { amount, currency } = req.body; // Obtener datos del cuerpo de la solicitud

    try {
        // Crear un PaymentMethod
        const paymentMethodId = await createPaymentMethod();

        // Crear un PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Monto en centavos
            currency: currency,
            payment_method: paymentMethodId,
            confirm: true, // Confirmar el pago automáticamente
        });

        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};