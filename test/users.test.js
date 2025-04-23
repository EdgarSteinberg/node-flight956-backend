const supertest = require('supertest');
const dotenv = require('dotenv');

dotenv.config();
const testerUser = {
    first_name: "Estrella",
    last_name: "Steinberg",
    email: "estrella@gmail.com",
    age: 22,
    password: "12345"
}

let testerId = null;
let testerToken = null;

const requester = supertest(`http://localhost:${process.env.PORT}`);

//Test para obtener todos los usuarios.

test("Debes obtener obtener todos los usuarios", async () => {
    const response = await requester
        .get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.payload)).toBe(true);
    expect(response.body.payload[0]).toHaveProperty("email");
    expect(response.body.payload[0]).toHaveProperty("first_name");

});


test("Debe registrar un usuario correctamente", async () => {
    const response = await requester
        .post("/api/users/register")
        .send(testerUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.email).toBe("estrella@gmail.com");

    testerId = response.body.payload._id;
});


test("Debe devolverme el usuario registrado por su ID", async () => {
    const response = await requester
        .get(`/api/users/${testerId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload).toHaveProperty("_id", testerId);
    expect(response.body.payload).toHaveProperty("first_name");
    expect(response.body.payload).toHaveProperty("last_name");
    expect(typeof response.body.payload._id).toBe("string");
});

test("Debe logear el usuario correctamente", async () => {
    const response = await requester
        .post("/api/users/login")
        .send({ email: testerUser.email, password: testerUser.password });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    testerToken = response.body.token;

});


test("Debe actualizar los datos del usuario correctamente", async () => {
    const newUser = { first_name: "Rocko", age: 33 }
    const response = await requester
        .put(`/api/users/${testerId}`)
        .send(newUser)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.first_name).toBe("Rocko");
    expect(response.body.payload.age).toBe(33);
});

test("Debe eliminar el usuario corectamente", async () => {
    const response = await requester
        .delete(`/api/users/${testerId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

});