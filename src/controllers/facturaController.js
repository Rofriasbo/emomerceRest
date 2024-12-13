const fs = require('fs');
const Carrito = require('../models/cartModel'); // Asegúrate de importar el modelo de carrito
const { createReceipt } = require('../api/factura'); // Asegúrate de importar tu servicio
const Facturapi = require('facturapi').default;
const facturapi = new Facturapi('sk_test_ReqP6ZDz35Nna4gyAmJbOw7mwJV7o8mElKG9X02BMJ'); // Reemplaza con tu clave API
const bucket = require('../api/firebase'); // Importa el bucket de Firebase
const twilio = require('twilio');

const client = new twilio(accountSid, authToken);
const { uploadFileToFirebase } = require('../api/firebase'); // Asegúrate de que la ruta sea correcta
// Función para enviar la factura y notificar al usuario
exports.sendInvoiceAndNotify = async (req, res) => {
    const { invoiceId, userPhoneNumber } = req.body; // Obtener el ID de la factura y el número de teléfono del usuario

    try {

        const message = await client.messages.create({
            body: `Su factura con ID ${invoiceId} ha sido enviada exitosamente.`,
            from: '+13613147924', // Tu número de Twilio
            to: '+523111095978' // Número de teléfono del destinatario
        });

        console.log('Mensaje de notificación enviado:', message.sid);
        res.status(200).json({ message: 'Factura enviada y notificación enviada por SMS.' });
    } catch (error) {
        console.error('Error al enviar la factura o el mensaje de notificación:', error);
        res.status(500).json({ message: 'Error al enviar la factura o el mensaje de notificación.', error: error.message });
    }
};
// Función para descargar el recibo en PDF
exports.downloadReceiptPdf = async (req, res) => {
    const { receiptId } = req.params; // Obtener el ID del recibo de los parámetros de la ruta

    try {
        // Descargar el PDF del recibo
        const pdfStream = await facturapi.receipts.downloadPdf(receiptId);
        const pdfFile = fs.createWriteStream(`./recibo_${receiptId}.pdf`);

        pdfStream.pipe(pdfFile);

        pdfFile.on('finish', () => {
            res.status(200).json({ message: 'Recibo descargado correctamente', file: `recibo_${receiptId}.pdf` });
        });

        pdfFile.on('error', (error) => {
            console.error('Error al escribir el archivo PDF:', error);
            res.status(500).json({ message: 'Error al descargar el recibo.' });
        });
    } catch (error) {
        console.error('Error al descargar el recibo:', error);
        res.status(400).json({ message: 'No se pudo descargar el recibo.', error: error.message });
    }
};

// Crear un recibo basado en el ID del carrito
exports.createReceiptFromCart = async (req, res) => {
    const { cartId } = req.params; // Obtener el ID del carrito de los parámetros de la ruta

    try {
        // Obtener el carrito por ID
        const carrito = await Carrito.findById(cartId);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Verificar si el carrito está cerrado
        if (carrito.status !== 'Inactivo') {
            return res.status(400).json({ message: 'El carrito debe estar cerrado para crear un recibo.' });
        }

        // Preparar los items para el recibo
        const items = await Promise.all(carrito.items.map(async item => {
            const productKey = item.productoId; // Este debe ser el product_key

            // Validar que el productKey sea el correcto
            if (productKey.length !== 8) {
                throw new Error(`El product_key "${productKey}" debe tener exactamente 8 caracteres.`);
            }

            return {
                quantity: item.cantidad,
                product: {
                    description: item.name,
                    product_key: productKey,
                    price: item.price,
                    sku: item.sku || 'N/A'
                }
            };
        }));

        // Crear el recibo en Facturapi usando un objeto JSON
        const receiptData = {
            folioNumber: carrito.total, // Usar el total del carrito como folio_number
            items: items
        };

        const receipt = await createReceipt(receiptData); // Pasar el objeto JSON
        res.status(201).json(receipt);
    } catch (error) {
        console.error('Error al crear el recibo:', error);
        if (error.response) {
            console.error('Respuesta de Facturapi:', error.response.data);
        }
        res.status(400).json({ message: 'No se pudo crear el recibo.', error: error.message });
    }
};

exports.sendReceiptByEmail = async (req, res) => {
    const { receiptId } = req.params; // Obtener el ID del recibo de los parámetros de la ruta
    const { email } = req.body; // Obtener el correo electrónico del cuerpo de la solicitud

    try {
        // Enviar el recibo por correo electrónico
        const response = await facturapi.receipts.sendByEmail(receiptId, { email });
        res.status(200).json({ message: 'Recibo enviado por correo electrónico correctamente.', response });
    } catch (error) {
        console.error('Error al enviar el recibo por correo electrónico:', error);
        res.status(400).json({ message: 'No se pudo enviar el recibo por correo electrónico.', error: error.message });
    }
};

// Crear una factura basada en el ID del carrito y los datos del cliente
exports.createInvoice = async (req, res) => {
    const { cartId, customer, items, payment_form, folio_number, series } = req.body; // Obtener datos del cuerpo de la solicitud

    try {
        // Verificar el estado del carrito
        const carrito = await Carrito.findById(cartId);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Verificar si el carrito está cerrado (Inactivo)
        if (carrito.status !== 'Inactivo') {
            return res.status(400).json({ message: 'El carrito debe estar cerrado para crear una factura.' });
        }

        // Preparar los items para la factura
        const preparedItems = items.map(item => {
            return {
                quantity: item.quantity,
                product: {
                    description: item.product.description,
                    product_key: item.product.product_key,
                    price: item.product.price
                }
            };
        });

        // Crear la factura en Facturapi
        const invoice = await facturapi.invoices.create({
            customer,
            items: preparedItems,
            payment_form,
            folio_number,
            series
        });

        // Responder con la factura creada
        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(400).json({ message: 'No se pudo crear la factura.', error: error.message });
    }
};
exports.downloadInvoiceFormats = async (req, res) => {
    const { invoiceId } = req.params; // Obtener el ID de la factura de los parámetros de la ruta

    try {
        // Descargar y guardar el PDF de la factura
        const pdfStream = await facturapi.invoices.downloadPdf(invoiceId);
        const pdfFilePath = `./factura_${invoiceId}.pdf`;
        const pdfFile = fs.createWriteStream(pdfFilePath);
        pdfStream.pipe(pdfFile);

        // Esperar a que el PDF se haya guardado
        await new Promise((resolve, reject) => {
            pdfFile.on('finish', resolve);
            pdfFile.on('error', reject);
        });

        // Subir el PDF a Firebase Storage
        await uploadFileToFirebase(pdfFilePath, `invoices/${invoiceId}.pdf`);

        // Descargar y guardar el XML de la factura
        const xmlStream = await facturapi.invoices.downloadXml(invoiceId);
        const xmlFilePath = `./factura_${invoiceId}.xml`;
        const xmlFile = fs.createWriteStream(xmlFilePath);
        xmlStream.pipe(xmlFile);

        // Esperar a que el XML se haya guardado
        await new Promise((resolve, reject) => {
            xmlFile.on('finish', resolve);
            xmlFile.on('error', reject);
        });

        // Subir el XML a Firebase Storage
        await uploadFileToFirebase(xmlFilePath, `invoices/${invoiceId}.xml`);

        // Responder con un mensaje de éxito
        res.status(200).json({
            message: 'Factura descargada y subida correctamente a Firebase Storage',
            files: {
                pdf: pdfFilePath,
                xml: xmlFilePath
            }
        });
    } catch (error) {
        console.error('Error al descargar la factura en formatos PDF y XML:', error);
        res.status(400).json({ message: 'No se pudo descargar la factura en formatos PDF y XML.', error: error.message });
    }
};
// Función para enviar la factura por correo electrónico
exports.sendInvoiceByEmail = async (req, res) => {
    const { invoiceId } = req.params; // Obtener el ID de la factura de los parámetros de la ruta
    const { email, userPhoneNumber } = req.body; // Obtener el correo electrónico y el número de teléfono del cuerpo de la solicitud

    try {
        // Enviar la factura por correo electrónico
        const response = await facturapi.invoices.sendByEmail(invoiceId, { email });
        
        // Enviar la notificación por SMS
        const message = await client.messages.create({
            body: `Su factura con ID ${invoiceId} ha sido emitida.`,
            from: '+13613147924', // Tu número de Twilio
            to: userPhoneNumber // Número de teléfono del destinatario
        });

        console.log('Mensaje de notificación enviado:', message.sid);

        // Descargar el PDF de la factura
        const pdfStream = await facturapi.invoices.downloadPdf(invoiceId);
        const pdfFilePath = `./factura_${invoiceId}.pdf`;
        const pdfFile = fs.createWriteStream(pdfFilePath);
        pdfStream.pipe(pdfFile);

        // Esperar a que el PDF se haya guardado
        await new Promise((resolve, reject) => {
            pdfFile.on('finish', resolve);
            pdfFile.on('error', reject);
        });

        // Subir el PDF a Firebase
        await uploadFileToFirebase(pdfFilePath, `invoices/${invoiceId}.pdf`);

        console.log('PDF subido a Firebase Storage');

        // Responder con éxito
        res.status(200).json({ message: 'Factura enviada por correo electrónico correctamente y notificación enviada por SMS.', response });
    } catch (error) {
        console.error('Error al enviar la factura por correo electrónico o el mensaje de notificación:', error);
        res.status(400).json({ message: 'No se pudo enviar la factura por correo electrónico o el mensaje de notificación.', error: error.message });
    }
};