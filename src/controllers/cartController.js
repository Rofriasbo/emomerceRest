const Carrito = require('../models/cartModel'); // Asegúrate de usar la ruta correcta del modelo

// Crear un nuevo carrito
exports.createCarrito = async (req, res) => {
    try {
        const carrito = new Carrito({
            clienteId: req.body.clienteId,
            items: req.body.items || [],
            fechaCreacion: new Date().toISOString(),
        });
        await carrito.save();
        res.status(201).json(carrito);
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).json({ message: 'No se pudo crear el carrito.' });
    }
};

// Obtener todos los carritos
exports.getCarritos = async (req, res) => {
    try {
        const carritos = await Carrito.find();
        res.status(200).json(carritos);
    } catch (error) {
        console.error('Error al obtener los carritos:', error.message);
        res.status(500).json({ message: 'No se pudieron obtener los carritos.' });
    }
};

// Obtener un carrito por ID
exports.getCarritoById = async (req, res) => {
    try {
        const carrito = await Carrito.findById(req.params.id);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }
        res.status(200).json(carrito);
    } catch (error) {
        console.error('Error al obtener el carrito:', error.message);
        res.status(500).json({ message: 'No se pudo obtener el carrito.' });
    }
};
// cartController.js

// Cambiar el estado de un carrito
exports.updateCarritoStatus = async (req, res) => {
    try {
        const carrito = await Carrito.findById(req.params.id);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Actualiza el estado del carrito
        carrito.status = req.body.status || carrito.status;

        await carrito.save();
        res.status(200).json(carrito);
    } catch (error) {
        console.error('Error al actualizar el estado del carrito:', error.message);
        res.status(500).json({ message: 'No se pudo actualizar el estado del carrito.' });
    }
};
// Actualizar un carrito
exports.updateCarrito = async (req, res) => {
    try {
        const carrito = await Carrito.findById(req.params.id);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        carrito.items = req.body.items || carrito.items;
        carrito.status = req.body.status || carrito.status;
        carrito.fechaCierre = req.body.fechaCierre || carrito.fechaCierre;

        await carrito.save();
        res.status(200).json(carrito);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error.message);
        res.status(500).json({ message: 'No se pudo actualizar el carrito.' });
    }
};

// Eliminar un carrito
exports.deleteCarrito = async (req, res) => {
    try {
        const carrito = await Carrito.findByIdAndDelete(req.params.id);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }
        res.status(200).json({ message: 'Carrito eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el carrito:', error.message);
        res.status(500).json({ message: 'No se pudo eliminar el carrito.' });
    }
};
