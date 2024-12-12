const Carrito = require('../models/Carrito');

const generarReporte = async (usuario) => {
  const historial = await Carrito.find({ "usuario.rfc": usuario, estatus: 'cerrado' });
  return historial;
};

module.exports = { generarReporte };
