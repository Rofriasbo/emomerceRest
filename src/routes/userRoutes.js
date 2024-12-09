const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas
router.get('/', userController.getAllUsers); // Obtener todos los usuarios
router.get('/:id', userController.getUserById); // Obtener usuario por ID
router.post('/', userController.createUser); // Crear un usuario (con Facturapi)
router.delete('/users/facturapi/:facturapiId', userController.deleteUserByFacturapiId); // Eliminar usuario (de MongoDB y Facturapi)

module.exports = router;