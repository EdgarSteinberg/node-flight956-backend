//npm test -- test/vuelos.test.js 
const supertest = require("supertest");
const dotenv = require("dotenv");

dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

const vueloTest = {
    empresa: "Aviancas",
    origen: "680030cc1ee2c22e96955833",  // ID de provincia de origen
    destino: "680030cc1ee2c22e96955833",  // ID de provincia de destino
    vuelo_ida: "2025-05-21T10:00:00Z",  // Fecha y hora de salida en formato ISO
    vuelo_vuelta: "2025-10-25T10:00:00Z", // día 25 del mes 10  // Fecha y hora de regreso en formato ISO (opcional)
    precio: 10000,
    duracion: "3h 45m",
    clase: "Económica",
    asientos_disponibles: 150,
    incluye_equipaje: true,
    pasajeros: ["67fe6702c0cbae60f3e54042"]  // ID del usuario en formato ObjectId
}

vueloId = null;

test("Debe obtener todos los Hoteles", async () => {
    const response = await requester
        .get("/api/vuelos")

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload[0]).toHaveProperty("empresa");
    expect(Array.isArray(response.body.payload)).toBe(true);
});

test("Debe crear un vuelo correctamente", async () => {
    const response = await requester
        .post("/api/vuelos")
        .send(vueloTest);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.empresa).toBe(vueloTest.empresa);
    expect(response.body.payload.origen).toBe(vueloTest.origen);

    vueloId = response.body.payload._id;
});


test("Debe obtener el vuelo por ID", async () => {
    const response = await requester
        .get(`/api/vuelos/${vueloId}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload).toMatchObject({
        empresa: vueloTest.empresa,
        clase: vueloTest.clase,
        origen: expect.objectContaining({ _id: vueloTest.origen }),
        destino: expect.objectContaining({ _id: vueloTest.destino }),
    });
});

test("Debe actualizar el vuelo correctamente", async () => {
    const newPrecio = 2000;
    const response = await requester
        .put(`/api/vuelos/${vueloId}`)
        .send({ precio: newPrecio });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.precio).toBe(newPrecio);
});

test("Debe eliminar el vuelo por ID", async () => {
    const response = await requester
        .delete(`/api/vuelos/${vueloId}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
});