const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configuración de OAuth2 con valores desde variables de entorno
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

// Subir archivo a Google Drive
async function uploadFile(filePath, fileName, mimeType) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
        });

        console.log('Archivo subido exitosamente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error subiendo archivo:', error.message);
        throw error;
    }
}

// Eliminar archivo de Google Drive
async function deleteFile(fileId) {
    try {
        const response = await drive.files.delete({
            fileId,
        });

        console.log('Archivo eliminado:', response.status);
        return response.status;
    } catch (error) {
        console.error('Error eliminando archivo:', error.message);
        throw error;
    }
}

// Generar un enlace público para un archivo
async function generatePublicUrl(fileId) {
    try {
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink',
        });

        console.log('Enlace público generado:', result.data);
        return result.data;
    } catch (error) {
        console.error('Error generando URL pública:', error.message);
        throw error;
    }
}

module.exports = {
    uploadFile,
    deleteFile,
    generatePublicUrl,
};
