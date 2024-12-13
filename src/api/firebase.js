const admin = require('firebase-admin');
const serviceAccount = require('../../serviciosweb-1590d-ead57153b162.json'); // Ruta a tu clave de servicio

// Inicializa la aplicación de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://serviciosweb-1590d.firebasestorage.app' // Reemplaza con tu URL de bucket
});

// Obtén el bucket de Firebase
const bucket = admin.storage().bucket();

// Función para subir archivos a Firebase
const uploadFileToFirebase = async (filePath, destination) => {
    await bucket.upload(filePath, {
        destination: destination,
        metadata: {
            contentType: 'application/pdf' // Cambia según el tipo de archivo
        }
    });
};

// Exporta tanto el bucket como la función de subida
module.exports = {
    bucket,
    uploadFileToFirebase
};