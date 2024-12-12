const Facturapi = require('facturapi').default;
require('dotenv').config();

const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

module.exports = facturapi;
