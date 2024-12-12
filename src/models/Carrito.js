const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  usuario: {
    nombre: String,
    apellido: String,
    rfc: String
  },
  productos: [
    {
      id_producto: String,
      cantidad: Number,
      precio: Number,
      descripcion: String
    }
  ],
  subtotal: Number,
  iva: Number,
  total: Number,
  estatus: { type: String, default: 'abierto' },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_cierre: Date
});

module.exports = mongoose.model('Carrito', carritoSchema);
