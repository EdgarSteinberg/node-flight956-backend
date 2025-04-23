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
        const { image, vuelo, hotel, origen_salida, destino, desde_fecha, hasta_fecha, total_paquete } = paquete;
        const paqueteError = [image, vuelo, hotel, origen_salida, destino, desde_fecha, hasta_fecha, total_paquete];

        if (paqueteError.some(paq => !paq)) {
            throw new Error("Todos los campos son obligatorios");
        }

        try {
            return await paqueteDao.createPaqueteDao({ image, vuelo, hotel, origen_salida, destino, desde_fecha, hasta_fecha, total_paquete });
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
