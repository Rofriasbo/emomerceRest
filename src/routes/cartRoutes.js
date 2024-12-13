const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/cartController');

// Rutas
router.get('/carrito', carritoController.getCarritos); 
router.get('/:id', carritoController.getCarritoById); 
router.post('/', carritoController.createCarrito); 
router.delete('/:id', carritoController.deleteCarrito);
router.put('/status/:id', carritoController.updateCarritoStatus); // Cambia el estado del carrito

module.exports = router;