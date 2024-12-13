const twilio = require('twilio');

const client = new twilio(accountSid, authToken);

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