// src/routes/receiptRoutes.js

const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController'); 

router.get('/download/:receiptId', facturaController.downloadReceiptPdf);
router.post('/from-cart/:cartId', facturaController.createReceiptFromCart);
router.post('/send-email/:receiptId', facturaController.sendReceiptByEmail);
router.post('/create-invoice', facturaController.createInvoice);
router.get('/download/formats/:invoiceId', facturaController.downloadInvoiceFormats);
router.post('/send-invoice-email/:invoiceId', facturaController.sendInvoiceByEmail);
module.exports = router;