// app.js o server.js
require('dotenv').config(); // Cargar las variables de entorno

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

const app = express();
app.use(express.json());

// Conectar a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 4000; // Usar el puerto definido en .env o 3000 por defecto
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});