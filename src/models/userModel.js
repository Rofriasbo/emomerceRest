const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String }, // Usamos _id como el facturapiId
    Name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tax_system: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        exterior_number: { type: String, required: true },
        interior_number: { type: String },
        neighborhood: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },
    registrationDate: { type: String, required: true },
    userTipe: { type: String, required: true },
    rfc: { type: String, required: true },
    PaymentMethod: { 
        type: String, 
        required: true, 
        enum: ['Tarjeta', 'Paypal', 'Bitcoin', 'Tarjeta de Credito'] 
    }
}, { _id: false }); // Desactiva la generación automática de _id

const User = mongoose.model('User', userSchema);
module.exports = User;