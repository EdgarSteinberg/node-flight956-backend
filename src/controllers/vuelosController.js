import VuelosDao from "../dao/vuelosDAO.js";
const vuelosDao = new VuelosDao();

class VuelosManager {

    async getAllVuelos() {
        return await vuelosDao.getAllVuelosDao();
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

        const requiredFields = [empresa, origen, destino, vuelo_ida, duracion, clase, asientos_disponibles, pasajeros, precio];
        if (requiredFields.some(field => !field)) {
            throw new Error("Todos los campos son obligatorios");
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