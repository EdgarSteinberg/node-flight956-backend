//npm test -- test/carts.test.js 
const supertest = require('supertest');
const dotenv = require('dotenv');
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

let testCart_id = null;

test("Debe obtener todos los carritos", async () => {
    const response = await requester
        .get("/api/carts")

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.payload)).toBe(true); // Verificamos que sea un array
});

test("Debe crear un carrito correctamente", async () => {
    const response = await requester
        .post("/api/carts")

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.payload).toHaveProperty("_id"); // Aseguramos que tenga _id

    testCart_id = response.body.payload._id;
    expect(typeof testCart_id).toBe("string"); // Validamos que sea string

});


test("Debe obtener el carrito por su ID", async () => {
    const response = await requester
        .get(`/api/carts/${testCart_id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    const cart = response.body.payload;
    expect(cart).toHaveProperty("_id", testCart_id); // El ID debe coincidir
    expect(cart).toHaveProperty("productos"); // Aseguramos que tenga la propiedad products
    expect(Array.isArray(cart.productos)).toBe(true); // Y que products sea un array
});

test("Debe agregar un producto al carrito", async () => {
    const product_id = "68004ab72be1af5ca6eeed85"; // Asegúrate de que este producto exista
    const referencia = "vuelos_fli";
    const quantity = 3;

    const response = await requester
        .post(`/api/carts/${testCart_id}/products/${product_id}`)
        .send({ referencia, quantity });  // Enviar como objeto

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    // Si tienes un campo de productos en la respuesta, puedes agregar una validación extra:
    const cart = response.body.payload;
    const addedProduct = cart.productos.find(product => {
        const id = typeof product.productoSchemaId === 'string'
          ? product.productoSchemaId
          : product.productoSchemaId._id;
      
        return id === product_id;
      });
    expect(addedProduct).toBeDefined(); // Se asegura que el producto fue agregado
    expect(addedProduct.quantity).toBe(quantity); // Verifica que la cantidad sea la correcta
    
});


test("Debe quitar el producto del carrito correctamente", async () => {
    const product_id = "68004ab72be1af5ca6eeed85";
    const referencia = "vuelos_fli";

    // Paso 1: eliminar
    const deleteResponse = await requester
        .delete(`/api/carts/${testCart_id}/products/${product_id}?referencia=${referencia}`);

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.status).toBe("success");

    // Paso 2: verificar que ya no esté
    const getResponse = await requester.get(`/api/carts/${testCart_id}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.status).toBe("success");

    const cart = getResponse.body.payload;
    const productoEliminado = cart.productos.find(
        (p) => p.product === product_id && p.referencia === referencia
    );

    expect(productoEliminado).toBeUndefined(); // ✨ Boom: no debe existir más
});


test("Debe eliminar el carrito correctamente", async () => {
    const response = await requester
        .delete(`/api/carts/${testCart_id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
});