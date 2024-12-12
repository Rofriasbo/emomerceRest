require("dotenv").config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log("Stripe Secret Key:", stripeKey); // Depuración: verifica que la clave no sea undefined

const stripe = require("stripe")(stripeKey);

async function procesarPago(monto, moneda, descripcion, idCliente = null, metodoDePago = null) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(monto * 100),
            currency: moneda,
            description,
            customer: idCliente || undefined,
            payment_method: metodoDePago || undefined,
            confirm: metodoDePago ? true : false,
        });

        console.log("Pago procesado correctamente:", paymentIntent);
        return paymentIntent;
    } catch (error) {
        console.error("Error al procesar el pago:", error.message);
        throw error;
    }
}

module.exports = {
    procesarPago,
};
