import VuelosDao from "../dao/vuelosDAO.js";
const vuelosDao = new VuelosDao();

class VuelosManager {

    async getAllVuelos() {
        return await vuelosDao.getAllVuelosDao();
    }

    async buscarVueloProvincia(nombreProvincia) {
        if (!nombreProvincia) throw new Error(`Nombre de provincia no encontrado`)
        try {
            const vuelos = await vuelosDao.buscarVueloProvinciaDao(nombreProvincia);

            if (vuelos.length === 0) {
                throw new Error(`No se encontraron vuelos para la provincia: ${nombreProvincia}`);
            }

            return vuelos;
        } catch (error) {
            throw new Error(`Error al obtener el vuelo por provincia ${error.message}`)
        }
    }

    async buscarVuelosFiltrados(busqueda) {
        const { origen, destino, vuelo_ida, vuelo_vuelta } = busqueda;

        if (!origen || !destino || !vuelo_ida) {
            throw new Error("Faltan datos obligatorios para buscar vuelos.");
        }
        try {
            const result = await vuelosDao.buscarVuelosFiltradosDao({ origen, destino, vuelo_ida, vuelo_vuelta })
            return result;
        } catch (error) {
            throw new Error(`Error al obtener los vuelos!`)
        }
    }

    async getVuelosById(vid) {
        try {
            const result = await vuelosDao.getVuelosByIdDao(vid);
            if (!result) throw new Error(`El vuelo con ID: ${vid} no se encuentra`);

            return result;
        } catch (error) {
            throw new Error(`Error al obtener los vuelos ${error.message}`);
        }
    }

    async createVuelos(vuelo) {
        const { empresa, origen, destino, vuelo_ida, vuelo_vuelta, precio, duracion, clase, asientos_disponibles, incluye_equipaje, pasajeros } = vuelo;

        if (!empresa || !origen || !destino || !vuelo_ida || !duracion || !clase || typeof precio !== 'number' || typeof asientos_disponibles !== 'number' ||
            !Array.isArray(pasajeros)
        ) {
            throw new Error("Faltan campos obligatorios o tienen el tipo incorrecto");
        }
        try {
            const result = await vuelosDao.createVuelosDao({ empresa, origen, destino, vuelo_ida, vuelo_vuelta, precio, duracion, clase, asientos_disponibles, incluye_equipaje, pasajeros })
            return result;
        } catch (error) {
            throw new Error(`Error al crear los vuelos ${error.message}`);
        }
    }

    async updatedVuelos(vid, updated) {
        const vuelo = await this.getVuelosById(vid);
        if (!vuelo) throw new Error(`El vuelo con ${vid} no se encuentra`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No puedes enviar datos vacios");
        }
        try {
            const result = await vuelosDao.updatedVuelosDao(vid, updated);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar el vuelo ${error.message}`);
        }
    }


    async deleteVuelos(vid) {
        const vuelo = await this.getVuelosById(vid);
        if (!vuelo) throw new Error(`El vuelo con ${vid} no se encuentra`);
        try {
            const result = await vuelosDao.deleteVuelosDao(vid);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar el vuelo ${error.message}`);
        }
    }
}

export default VuelosManager;