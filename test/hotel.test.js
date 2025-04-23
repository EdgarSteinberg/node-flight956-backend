//npm test -- test/hotel.test.js 
const supertest = require("supertest");
const dotenv = require("dotenv");

dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

const testHotel = {
    image: ["imgPrueba"],
    name: "Sheraton",
    location: "680030cc1ee2c22e96955833",
    description: "Hotel costanera",
    stars: 5,
    nightPrice: 100,
    price: 1000,
    breakfastIncluded: true
}
let hotel_id = null;

test("Cada hotel debe tener los campos esperados", async () => {
    const response = await requester.get("/api/hoteles");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const hoteles = response.body.payload;
    expect(Array.isArray(hoteles)).toBe(true);
    expect(hoteles.length).toBeGreaterThan(0);

    const hotel = hoteles[0];

    expect(hotel).toHaveProperty("_id");
    expect(hotel).toHaveProperty("name");
    expect(typeof hotel._id).toBe("string");
});

test("Debe crear un Hotel correctamente", async () => {
    const response = await requester
        .post('/api/hoteles')
        .send(testHotel); // Asegurate de tener este objeto definido antes

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const hotel = response.body.payload;

    // Guardamos el ID para futuros tests
    hotel_id = hotel._id;

    // Validamos propiedades clave del hotel
    expect(hotel).toHaveProperty("name");
    expect(hotel.name).toBe(testHotel.name);
    expect(hotel).toHaveProperty("location");
});

test("Debe traer el hotel por su ID correctamente", async () => {
    const response = await requester
        .get(`/api/hoteles/${hotel_id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.name).toBe(testHotel.name);
    expect(response.body.payload.location._id.toString()).toBe(testHotel.location);
});


test("Debe actualizar el hotel correctamente", async () => {
    const newDescription = { description: "Nuevo Hotel Sheraton" };

    const response = await requester
        .put(`/api/hoteles/${hotel_id}`)
        .send(newDescription);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload.description).toBe(newDescription.description);

});


test("Debe eliminar el hotel correctamente", async () => {
    const response = await requester
        .delete(`/api/hoteles/${hotel_id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
});