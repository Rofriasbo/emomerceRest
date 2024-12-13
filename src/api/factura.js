
// src/api/factura.js
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const Facturapi = require('facturapi').default;
const facturapi = new Facturapi('sk_test_ReqP6ZDz35Nna4gyAmJbOw7mwJV7o8mElKG9X02BMJ'); // Reemplaza con tu clave API

// Modificación de la función createReceipt para aceptar un objeto JSON
async function createReceipt(receiptData) {
    const { folioNumber, items } = receiptData; // Desestructuramos el objeto JSON

    const receiptPayload = {
        folio_number: folioNumber,
        payment_form: Facturapi.PaymentForm.DINERO_ELECTRONICO,
        items: items
    };

    try {
        const receipt = await facturapi.receipts.create(receiptPayload);
        return receipt;
    } catch (error) {
        console.error('Error al crear el recibo en Facturapi:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? error.response.data : null
        });
        throw new Error('No se pudo crear el recibo en Facturapi.');
    }
}

module.exports = {
    createReceipt
};