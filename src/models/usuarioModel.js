const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rfc: { type: String, required: true, unique: true }, // RFC del usuario
  direccion: {
    zip: { type: String, required: true },
    calle: { type: String },
    ciudad: { type: String },
    estado: { type: String }
  },
  facturapi_id: { type: String, required: true }, // ID de Facturapi asociado al cliente
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
