const { GraphQLString, GraphQLNonNull } = require('graphql');
const UsuarioType = require('../types/usuarioType');
const Facturapi = require('facturapi').default; // Asegúrate de importar correctamente la librería

// Crear una instancia de Facturapi
const facturapi = new Facturapi('sk_test_9Zrdly8JRDAjBQmz0lvGPj3M15knvP53GELb6gXpN1');

const Usuario = require('../models/usuarioModel');

const resolvers = {
  Mutation: {
    // Crear cliente en Facturapi y guardar en la base de datos
    async crearCliente(_, { input }) {
      try {
        // Crear cliente en Facturapi
        const clienteFacturapi = await facturapi.customers.create({
          legal_name: input.legal_name,
          email: input.email,
          tax_id: input.tax_id,
          tax_system: input.tax_system,
          address: {
            zip: input.address.zip,
          },
        });

        // Guardar cliente en MongoDB
        const nuevoUsuario = new Usuario({
          legal_name: input.legal_name,
          tax_id: input.tax_id,
          tax_system: input.tax_system,
          email: input.email,
          address: {
            zip: input.address.zip,
          },
        });

        await nuevoUsuario.save();

        return nuevoUsuario;
      } catch (error) {
        console.error('Error creando cliente:', error);
        throw new Error('Error creando cliente en Facturapi.');
      }
    },
  },
};

module.exports = resolvers;
