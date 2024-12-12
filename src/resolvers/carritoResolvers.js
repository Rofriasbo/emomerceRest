const { procesarPago } = require('../apis/stripeApi');
const { emitirFactura } = require("../controllers/facturaController");
const { uploadFile, generatePublicUrl } = require('../apis/googleDriveApi');
const Carrito = require('../models/Carrito');

const resolvers = {
  Query: {
    LeerCarrito: async (_, { id_carrito }) => await Carrito.findById(id_carrito),
    leerHistorial: async (_, { usuario }) =>
      await Carrito.find({ "usuario.rfc": usuario, estatus: "cerrado" }),
  },
  Mutation: {
    CrearCarrito: async (_, { usuario }) => {
      console.log("Resolver CrearCarrito ejecutado"); // Confirmación de ejecución
      console.log("Usuario recibido:", usuario); // Para verificar que los datos llegan correctamente
    
      if (!usuario || !usuario.nombre || !usuario.apellido || !usuario.rfc) {
        throw new Error("Todos los campos de usuario son obligatorios.");
      }
    
      try {
        const nuevoCarrito = new Carrito({
          usuario,
          productos: [],
          subtotal: 0,
          iva: 0,
          total: 0,
          estatus: "abierto",
        });
        const resultado = await nuevoCarrito.save();
        console.log("Carrito guardado exitosamente:", resultado); // Confirmación de éxito
        return resultado;
      } catch (error) {
        console.error("Error al guardar el carrito:", error.message);
        throw new Error("Error al crear el carrito.");
      }
    },    
    AgregarProducto: async (_, { id_carrito, producto }) => {
      try {
        const carrito = await Carrito.findById(id_carrito);
        if (!carrito) {
          throw new Error("Carrito no encontrado");
        }
    
        if (carrito.estatus === "cerrado") {
          throw new Error("No se pueden agregar productos a un carrito cerrado");
        }
    
        // Agrega el producto al carrito
        carrito.productos.push(producto);
    
        // Recalcula los totales
        carrito.subtotal += producto.precio * producto.cantidad;
        carrito.iva = carrito.subtotal * 0.16; // 16% IVA
        carrito.total = carrito.subtotal + carrito.iva;
    
        const resultado = await carrito.save();
        console.log("Producto agregado exitosamente:", producto); // Para depuración
        return resultado;
      } catch (error) {
        console.error("Error al agregar producto:", error.message);
        throw new Error("No se pudo agregar el producto.");
      }
    },    
    ActualizarCantidad: async (_, { id_carrito, id_producto, cantidad }) => {
      try {
        const carrito = await Carrito.findById(id_carrito);
        if (!carrito) {
          throw new Error("Carrito no encontrado");
        }
    
        if (carrito.estatus === "cerrado") {
          throw new Error("No se pueden actualizar productos en un carrito cerrado");
        }
    
        // Encuentra el producto dentro del carrito
        const producto = carrito.productos.find(
          (prod) => prod.id_producto === id_producto
        );
    
        if (!producto) {
          throw new Error("Producto no encontrado en el carrito");
        }
    
        // Actualiza la cantidad del producto
        producto.cantidad = cantidad;
    
        // Recalcula el subtotal, IVA y total
        carrito.subtotal = carrito.productos.reduce(
          (acc, prod) => acc + prod.precio * prod.cantidad,
          0
        );
        carrito.iva = carrito.subtotal * 0.16; // 16% IVA
        carrito.total = carrito.subtotal + carrito.iva;
    
        const resultado = await carrito.save();
        console.log("Cantidad actualizada exitosamente:", resultado); // Depuración
        return resultado;
      } catch (error) {
        console.error("Error al actualizar cantidad:", error.message);
        throw new Error("No se pudo actualizar la cantidad del producto.");
      }
    },    
    CerrarCarrito: async (_, { id_carrito }) => {
      const carrito = await Carrito.findById(id_carrito);
      carrito.estatus = "cerrado";
      carrito.fecha_cierre = new Date();
      return await carrito.save();
    },
facturar: async (_, { id_carrito }) => {
  try {
    // Obtén el carrito de la base de datos
    const carrito = await Carrito.findById(id_carrito);
    if (!carrito) {
      throw new Error("Carrito no encontrado");
    }

    if (carrito.estatus !== "cerrado") {
      throw new Error("Solo se pueden facturar carritos cerrados");
    }

    if (!carrito.usuario || !carrito.usuario.rfc) {
      throw new Error("El carrito no tiene información de cliente válida");
    }

    // Genera la factura con FacturAPI
    const factura = await emitirFactura({
      cliente: {
        nombre: `${carrito.usuario.nombre} ${carrito.usuario.apellido}`,
        rfc: carrito.usuario.rfc,
      },
      productos: carrito.productos.map((prod) => ({
        cantidad: prod.cantidad,
        descripcion: prod.descripcion,
        precio: prod.precio,
      })),
      total: carrito.total,
    });

    console.log("Factura generada exitosamente:", factura);
    return {
      id: factura.id,
      total: factura.total,
      cliente: `${carrito.usuario.nombre} ${carrito.usuario.apellido}`,
      fecha: factura.fecha,
    };
  } catch (error) {
    console.error("Error al generar la factura:", error.message);
    throw new Error("No se pudo generar la factura.");
  }
},
    subirFactura: async (_, { filePath, fileName }) => {
      try {
        const mimeType = "application/pdf"; // Cambia si es necesario
        const archivo = await uploadFile(filePath, fileName, mimeType);
        const publicUrl = await generatePublicUrl(archivo.id);
        return publicUrl;
      } catch (error) {
        console.error("Error al subir la factura:", error.message);
        throw error;
      }
    },
    procesarPago: async (_, { monto, moneda, descripcion }) => {
      try {
        const pago = await procesarPago(monto, moneda, descripcion);
        return {
          id: pago.id,
          status: pago.status,
          amount: pago.amount / 100, // Stripe usa centavos
          currency: pago.currency,
        };
      } catch (error) {
        console.error("Error al procesar el pago:", error.message);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
