const stripe = require('../config/stripeConfig');

const procesarPago = async (monto, moneda, descripcion) => {
  const pago = await stripe.paymentIntents.create({
    amount: monto * 100, // Stripe usa centavos
    currency: moneda,
    description,
  });
  return pago;
};

module.exports = { procesarPago };
