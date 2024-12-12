const Facturapi = require("facturapi").default;

const facturapi = new Facturapi( 
    "sk_test_9Zrdly8JRDAjBQmz0lvGPj3M15knvP53GELb6gXpN1"
);

async function createProduct(product){
    //propiedades obligatorias para facturapi
    const facturapiProduct = {
        description: product.description,
        product_key: "50202306",
        price: product.price
    };
    return await facturapi.products.create(facturapiProduct);
}

module.exports = {createProduct};