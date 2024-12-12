const express = require('express');
const { emitirFactura } = require('../controllers/facturaController');

const router = express.Router();

router.post('/:id_carrito/facturar', async (req, res) => {
  const factura = await emitirFactura(req.params.id_carrito);
  res.json(factura);
});

module.exports = router;
