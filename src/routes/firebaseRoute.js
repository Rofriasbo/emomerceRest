const express = require('express');
const multer = require('multer');
const bucket = require('../api/firebase'); // Importa el bucket de Firebase

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para almacenar archivos

// Endpoint para subir archivos
router.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path; // Ruta del archivo temporal
    const destination = `uploads/${req.file.originalname}`; // Destino en Firebase

    try {
        await bucket.upload(filePath, {
            destination: destination,
            metadata: {
                contentType: req.file.mimetype // Tipo de archivo
            }
        });
        res.status(200).json({ message: 'Archivo subido correctamente a Firebase Storage' });
    } catch (error) {
        console.error('Error al subir el archivo a Firebase:', error);
        res.status(500).json({ message: 'Error al subir el archivo a Firebase', error: error.message });
    }
});

module.exports = router;