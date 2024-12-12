const { buildSchema } = require('graphql');

const carritoSchema = buildSchema(`
  type Usuario {
    nombre: String
    apellido: String
    rfc: String
  }

  type Producto {
    id_producto: ID
    cantidad: Int
    precio: Float
    descripcion: String
  }

  type Carrito {
    id_carrito: ID
    usuario: Usuario
    productos: [Producto]
    subtotal: Float
    iva: Float
    total: Float
    estatus: String
    fecha_creacion: String
    fecha_cierre: String
  }

  type Factura {
    id: ID
    total: Float
    cliente: String
    fecha: String
  }

  type PublicUrl {
    webViewLink: String
    webContentLink: String
  }

  type Pago {
    id: ID
    status: String
    amount: Float
    currency: String
  }

  type Query {
    LeerCarrito(id_carrito: ID!): Carrito
    leerHistorial(usuario: ID!): [Carrito]
  }

  type Mutation {
    AgregarProducto(id_carrito: ID!, producto: ProductoInput!): Carrito
    EliminarProducto(id_carrito: ID!, id_producto: ID!): Carrito
    ActualizarCantidad(id_carrito: ID!, id_producto: ID!, cantidad: Int!): Carrito
    CrearCarrito(usuario: UsuarioInput!): Carrito
    CerrarCarrito(id_carrito: ID!): Carrito
    facturar(id_carrito: ID!): Factura
    subirFactura(filePath: String!, fileName: String!): PublicUrl
    procesarPago(monto: Float!, moneda: String!, descripcion: String!): Pago
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    rfc: String!
  }

  input ProductoInput {
    id_producto: ID!
    cantidad: Int!
    precio: Float!
    descripcion: String!
  }
`);

module.exports = carritoSchema;
