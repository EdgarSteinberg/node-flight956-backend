const supertest = require("supertest");
const dotenv = require("dotenv");
dotenv.config()
const requester = supertest(`http://localhost:${process.env.PORT}`);

const testPaquete = {
    image: ["https://cdn.pixabay.com/photo/2021/01/01/travel-package.jpg"],
    vuelo: "680107ffa57e355f7d9fe0c7",
    hotel: "680108dca57e355f7d9fe0cd",
    origen_salida: "680030cc1ee2c22e96955833",
    destino: "680030cc1ee2c22e96955833",
    desde_fecha: "2025-08-10",
    hasta_fecha: "2025-08-17",
    total_paquete: 154999
}

let paquete_id = null;

// 📦 Test para obtener todos los paquetes
test("Debe obtener todos los paquetes", async () => {
    const response = await requester.get("/api/paquetes");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.payload)).toBe(true);

    const paquete = response.body.payload[0];
    // Validamos que el paquete tenga propiedades clave
    expect(paquete).toHaveProperty("vuelo");
    expect(paquete).toHaveProperty("hotel");
    expect(paquete).toHaveProperty("total_paquete");
    // Validamos tipos
    expect(typeof paquete.vuelo).toBe("string");
    expect(typeof paquete.total_paquete).toBe("number");
});

// ✅ Test para crear un nuevo paquete
test("Debe crear un paquete correctamente", async () => {
    const response = await requester
        .post("/api/paquetes")
        .send(testPaquete);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const created = response.body.payload;

    // Guardamos el ID para los siguientes tests
    paquete_id = created._id;

    // Verificamos que los datos sean consistentes
    expect(created).toHaveProperty("_id");
    expect(created.total_paquete).toBe(testPaquete.total_paquete);
    expect(created.vuelo).toBe(testPaquete.vuelo);
});

// 🔄 Test para actualizar el paquete
test("Debe actualizar el paquete correctamente", async () => {
    const newTotal = 25000;
    const response = await requester
        .put(`/api/paquetes/${paquete_id}`)
        .send({ total_paquete: newTotal });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.total_paquete).toBe(newTotal); //  
});

// ❌ Test para eliminar un paquete por ID
test("Debe eliminar un paquete correctamente", async () => {
    const response = await requester
        .delete(`/api/paquetes/${paquete_id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
});