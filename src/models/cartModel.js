const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    clienteId: { type: String, required: true 
    },
    items: [{
        productoId: { type: String, required: true },
        name: { type: String },
        price: { type: Number },
        cantidad: { type: Number, default: 1 },
        subtotal: { type: Number },
        iva: { type: Number },
    }],
    total: { type: Number, default: 0 }, // Inicializamos en 0
    status: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    fechaCreacion: { type: String },
    fechaCierre: { type: String },
});

// Método para calcular el total antes de guardar el carrito
carritoSchema.pre('save', function(next) {
    this.total = this.items.reduce((total, item) => (total + item.subtotal)+(item.iva), 0);
    next();
});

const Carrito = mongoose.model('Carrito', carritoSchema);
module.exports = Carrito;