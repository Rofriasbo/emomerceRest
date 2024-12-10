const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

// Ruta para crear un carrito, ahora requiere el ID del usuario
router.post('/', cartController.createCart); // Cambiamos la ruta para incluir el userId
router.put('/:id', cartController.updateCart);
router.patch('/:id/close', cartController.closeCart);
router.get('/:id', cartController.getCartById);
router.get('/', cartController.getAllCarts); // Agrega esta línea
module.exports = router;