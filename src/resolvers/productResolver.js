const Product = require('../models/productModel');
const { createProduct, deleteProduct } = require('../apis/facturapi'); // Importar la función para eliminar de Facturapi

const resolvers = {
  Query: {
    products: async () => await Product.find(),
  },

  Mutation: {
    createProduct: async (_, args) => {
      try {
        // Crear producto en Facturapi
        const facturapiProduct = await createProduct({
          description: args.description,
          product_key: "50202306", // Ajustar el código de producto
          price: args.price,
        });

        // Crear producto en MongoDB
        const nuevoProducto = new Product({
          ...args,
          facturapiid: facturapiProduct.id,
        });
        return await nuevoProducto.save();
      } catch (error) {
        console.error("Error al crear producto:", error.message);
        throw new Error("No se pudo crear el producto.");
      }
    },

    updateProduct: async (_, { _id, ...rest }) => {
      try {
        const productoActualizado = await Product.findByIdAndUpdate(
          _id,
          rest,
          { new: true }
        );
        if (!productoActualizado) throw new Error("Producto no encontrado.");
        return productoActualizado;
      } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        throw new Error("No se pudo actualizar el producto.");
      }
    },

    deleteProduct: async (_, { _id }) => {
      try {
        // Eliminar producto de MongoDB
        const productoEliminado = await Product.findByIdAndDelete(_id);
        if (!productoEliminado) throw new Error("Producto no encontrado.");

        // Eliminar producto de Facturapi
        await deleteProduct(productoEliminado.facturapiid);  // Asumimos que tienes el ID de Facturapi en facturapiid

        return productoEliminado;
      } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        throw new Error("No se pudo eliminar el producto.");
      }
    },
  },
};

module.exports = resolvers;
