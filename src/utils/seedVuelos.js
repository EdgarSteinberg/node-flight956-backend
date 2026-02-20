import mongoose from 'mongoose';
import dotenv from 'dotenv';
import vuelosModels from '../models/vuelosModels.js';
import provinciasModel from '../models/provModel.js'; // Tu modelo de prov_fli

dotenv.config();

/* const empresas = ['Aerolíneas Argentinas', 'FlyBondi', 'JetSmart', 'LATAM'];
const clases = ['Económica', 'Ejecutiva', 'Primera'];

function randomFechaDentroDeNDías(n) {
    const hoy = new Date();
    const futuro = new Date();
    futuro.setDate(hoy.getDate() + Math.floor(Math.random() * n));
    futuro.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
    return futuro;
}

function randomDuracion() {
    const horas = Math.floor(Math.random() * 4) + 1; // 1 a 5 horas
    const minutos = Math.floor(Math.random() / 2 * 60); // 0 a 30 min
    return `${horas}h ${minutos}m`;
}

async function generarVuelos() {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Asegurate que esté en .env

        const provincias = await provinciasModel.find();

        const vuelosAGenerar = [];

        for (let origen of provincias) {
            for (let destino of provincias) {
                if (origen._id.toString() !== destino._id.toString()) {
                    const vueloIda = randomFechaDentroDeNDías(30);
                    const vueloVuelta = new Date(vueloIda);
                    vueloVuelta.setDate(vueloIda.getDate() + 7);

                    vuelosAGenerar.push({
                        empresa: empresas[Math.floor(Math.random() * empresas.length)],
                        origen: origen._id,
                        destino: destino._id,
                        vuelo_ida: vueloIda,
                        vuelo_vuelta: vueloVuelta,
                        precio: Math.floor(Math.random() * 40000) + 20000, // 20k - 60k
                        duracion: randomDuracion(),
                        clase: clases[Math.floor(Math.random() * clases.length)],
                        asientos_disponibles: Math.floor(Math.random() * 120) + 30,
                        incluye_equipaje: Math.random() < 0.5
                    });
                }
            }
        }

        await vuelosModels.deleteMany({}); // Borra los anteriores si querés limpiar
        await vuelosModels.insertMany(vuelosAGenerar);
        console.log(`✔️ Se generaron ${vuelosAGenerar.length} vuelos correctamente`);
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error generando vuelos:', err);
    }
}

generarVuelos();
 */


async function actualizarFechasVuelos() {
    try {
   

        await mongoose.connect(process.env.MONGO_URI);

        const vuelos = await vuelosModels.find();

        for (let vuelo of vuelos) {
            vuelo.vuelo_ida = new Date(vuelo.vuelo_ida.getTime() + 30 * 24 * 60 * 60 * 1000);
            if (vuelo.vuelo_vuelta) {
                vuelo.vuelo_vuelta = new Date(vuelo.vuelo_vuelta.getTime() + 30 * 24 * 60 * 60 * 1000);
            }
            await vuelo.save();
        }

        console.log(`✔️ Se actualizaron ${vuelos.length} vuelos correctamente`);
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error actualizando vuelos:', err);
    }
}

actualizarFechasVuelos();

// desde PS C:\Users\ACER\Documents\fligth956\node\node-flight956-backend>
// comando para correr la actualizacion de los vuelos node src/utils/seedVuelos.js
// no hace falta correr mas nada