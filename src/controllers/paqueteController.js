import PaqueteDao from "../dao/paqueteDao.js";
const paqueteDao = new PaqueteDao();

class PaqueteManager {

    async getAllPaquete() {
        try {
            return await paqueteDao.getAllPaqueteDao();
        } catch (error) {
            throw new Error(`Error al obtener los paquetes: ${error.message}`);
        }
    }

    async buscarPaquetePorProvincia(nombreProvincia) {
        if (!nombreProvincia) throw new Error(`Debe agregar el nombre de la provincia`);

        try {
            const paquete = await paqueteDao.buscarPaquetePorProvinciaDao(nombreProvincia);
            if (paquete.length === 0) {
                throw new Error(`No se encontraron paquetes para la provincia: ${nombreProvincia}`);
            }
            return paquete;
        } catch (error) {
            throw new Error(`Error al buscar la provincia "${nombreProvincia}": ${error.message}`);

        }
    }

    async buscarPaquetesFiltrados(busqueda) {
        const { destino, desde_fecha, hasta_fecha } = busqueda;

        if (!destino || !desde_fecha || !hasta_fecha) {
            throw new Error('Todos los campos son obligatorios!');
        }

        try {
            const result = await paqueteDao.buscarPaquetesFiltradosDao({ destino, desde_fecha, hasta_fecha })
            return result;
        } catch (error) {
            throw new Error(`Error al obtener los paquetes: ${error.message}`);
        }
    }

    async getPaqueteById(pid) {
        try {
            const result = await paqueteDao.getPaqueteByIdDao(pid);
            if (!result) throw new Error(`No se encontró el paquete con ID: ${pid}`);
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el paquete: ${error.message}`);
        }
    }

    async createPaquete(paquete) {
        const { vuelo, hotel, destino, desde_fecha, hasta_fecha } = paquete;

        if (!vuelo || !hotel || !destino || !desde_fecha || !hasta_fecha) {
            throw new Error(`Todos los campos son obligatorios`)
        }

        const desdeFecha = new Date();
        const hastaFecha = new Date();
        hastaFecha.setDate(desdeFecha.getDate() + 7); // 7 días después
        try {
            return await paqueteDao.createPaqueteDao({ vuelo, hotel, destino, desde_fecha: desdeFecha, hasta_fecha: hastaFecha });
        } catch (error) {
            throw new Error(`Error al crear el paquete: ${error.message}`);
        }
    }

    async updatedPaquete(pid, updated) {
        const paquete = await this.getPaqueteById(pid);
        if (!paquete) throw new Error(`El paquete con ID: ${pid} no se encontró`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("Faltan datos || No puedes enviar datos vacíos");
        }

        try {
            return await paqueteDao.updatedPaqueteDao(pid, updated);
        } catch (error) {
            throw new Error(`Error al actualizar el paquete: ${error.message}`);
        }
    }

    async deletePaquete(pid) {
        const paquete = await this.getPaqueteById(pid);
        if (!paquete) throw new Error(`El paquete con ID: ${pid} no se encontró`);

        try {
            return await paqueteDao.deletePaqueteDao(pid);
        } catch (error) {
            throw new Error(`Error al eliminar el paquete: ${error.message}`);
        }
    }
}

export default PaqueteManager;
