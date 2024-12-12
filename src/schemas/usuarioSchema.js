// src/schemas/usuarioSchema.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  legal_name: {
    type: String,
    required: true,
  },
  tax_id: {
    type: String,
    required: true,
  },
  tax_system: {
    type: String,
    required: true,
    enum: ['601', '603', '604', '605', '606', '607', '608'], // Puedes agregar los otros valores del régimen fiscal que manejes
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  address: {
    zip: {
      type: String,
      required: true,
    },
    // Aquí puedes agregar más campos de la dirección si los necesitas (calle, ciudad, etc.)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
