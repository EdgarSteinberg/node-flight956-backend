//npm test -- test/prov.test.js 
const supertest = require("supertest");
const dotenv = require("dotenv");

dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

let testProvId = null;

test("debe obtener todas las ciudades", async () => {
    const response = await requester.get("/api/provincias");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.payload)).toBe(true);
    expect(response.body.payload.length).toBeGreaterThan(0);
    expect(typeof response.body.payload[0].name).toBe("string");
});

test("Debe crear una ciudad correctamente", async () => {
    const newCity = { name: "Mendoza" }
    const response = await requester
        .post("/api/provincias")
        .send(newCity);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.name).toBe(newCity.name);
    testProvId = response.body.payload._id;
    console.log(testProvId)
});


test("Debe traer la ciudad con ID correctamente", async () => {
    const response = await requester
        .get(`/api/provincias/${testProvId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload).toHaveProperty("name");
    expect(response.body.payload._id).toBe(testProvId);
});

test("Debe actualizar la ciudad correctamente", async () => {
    const newName = { name: "misiones" }
    const response = await requester
        .put(`/api/provincias/${testProvId}`)
        .send(newName);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
});

test("Debe eliminar la ciudad correctamente", async () => {
    const response = await requester
        .delete(`/api/provincias/${testProvId}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
});


