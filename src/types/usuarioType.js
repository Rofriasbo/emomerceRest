// src/types/usuarioType.js
const { GraphQLObjectType, GraphQLString } = require('graphql');

const UsuarioType = new GraphQLObjectType({
  name: 'Usuario',
  fields: () => ({
    id: { type: GraphQLString },
    legal_name: { type: GraphQLString },
    tax_id: { type: GraphQLString },
    tax_system: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },  // Puedes expandir para incluir otros campos de dirección si lo necesitas
  }),
});

module.exports = UsuarioType;
