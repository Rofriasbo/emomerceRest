//const { createUser } = require('../services/userServices');

// a) Importa el paquete
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const Facturapi = require('facturapi').default;
// b) Crea una instancia del cliente, usando la llave secreta

//    de la organización emisora (https://dashboard.facturapi.io/integration/apikeys)
const facturapi = new Facturapi('sk_test_ReqP6ZDz35Nna4gyAmJbOw7mwJV7o8mElKG9X02BMJ');


async function createProduct(product) {
  const facturapiProduct = {
    description: product.description,
    product_key: "50202306",
    price: product.price
  };
  return await facturapi.products.create(facturapiProduct);
}

async function createUser(user) {
  console.log('ptm user aqui va: ', user);
  try {
    const facturapiUser = {
      legal_name: user.Name,
      tax_id: user.rfc,
      tax_system: '612',
      address: {
        zip: user.address.zip,
      },
      email: user.email
      
    };
    console.log('Datos enviados a Facturapi:', facturapiUser);
    const elClientealv = await facturapi.customers.create(facturapiUser);
    console.log('hsdfkjhsdfkjhsdfkjhsdfkjhsdf: ', elClientealv);
    return elClientealv;
  } catch (error) {
    console.error('Error al crear el usuario en Facturapi:', {
      message: error.message,
      stack: error.stack,
      response: error
    });
    //throw new Error('No se pudo crear el usuario en Facturapi.');
  }
}


async function removedCustomer(idU) {
  try {
    console.log("ID del cliente recibido:", idU); // Log para depuración
    return await facturapi.customers.del(idU);
  } catch (error) {
    console.error('Error al eliminar el cliente en Facturapi:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : null
    });
    throw new Error('No se pudo eliminar el usuario en Facturapi.');
  }



};


module.exports = {
  createProduct,
  createUser,
  removedCustomer
};