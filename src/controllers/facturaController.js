const Facturapi = require('facturapi').default;
const facturapi = new Facturapi('sk_test_9Zrdly8JRDAjBQmz0lvGPj3M15knvP53GELb6gXpN1'); // Usar tu clave API de pruebas

// Función para crear un cliente en Facturapi
async function createClient({ nombre, rfc, email, direccion }) {
  try {
    // Crear un cliente en Facturapi
    const cliente = await facturapi.customers.create({
      legal_name: nombre, // Nombre completo del cliente
      tax_id: rfc, // RFC del cliente
      tax_system: '601', // Régimen fiscal
      email: email,
      address: {
        zip: direccion.zip,
        street: direccion.calle,
        city: direccion.ciudad,
        state: direccion.estado
      }
    });
    return cliente; // Retornar el cliente creado de Facturapi
  } catch (error) {
    console.error('Error al crear el cliente en Facturapi:', error.message);
    throw new Error('Error al crear el cliente en Facturapi');
  }
}

module.exports = { createClient };
