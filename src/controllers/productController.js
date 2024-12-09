const Product = require('../models/productModel');
const facturapiService = require('../api/facturapiService'); // Asegúrate de importar el servicio

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    const { name, description, price, category, brand, stock, imgs, product_key } = req.body;

    try {
        // Crear el producto en tu base de datos
        const newProduct = new Product({ name, description, price, category, brand, stock, imgs, product_key });
        await newProduct.save();

        // Crear el producto en Facturapi
        const facturapiProduct = await facturapiService.createProduct({
            name,
            product_key,
            price,
            id
        });
        console.log('Datos del producto para Facturapi:', { name, product_key, price });
        // Responder con el producto creado
        res.status(201).json({ newProduct, facturapiProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, brand, stock, imgs, product_key } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, brand, stock, imgs, product_key }, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};