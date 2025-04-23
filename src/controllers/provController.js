import ProvDao from "../dao/provDao.js";
const provDao = new ProvDao();

class ProvController {
    
    async getAllProv() {
        return await provDao.getAllProvDao();
    }

    async getProvById(piv) {
        try {
            const result = await provDao.getProvByIdDao(piv);
            if (!result) throw new Error("Provincia no encontrada");

            return result;
        } catch (error) {
            throw new Error(`Error al obtener la provincia ${error.message}`)
        }
    }

    async createProv(prov) {
        const { name, country } = prov;
        if (!name) throw new Error("Debes agregar la provincia.");

        try {
            const result = await provDao.createProvDao({ name, country });
            return result;
        } catch (error) {
            throw new Error(`Error al crear la provincia. ${error.message}`);
        }
    }

    async updatedProv(pid, updated) {
        const provincia = await this.getProvById(pid);
        if (!provincia) throw new Error(`La provincia con ID ${pid} no existe.`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No pueden enviar datos vacíos");
        }

        try {
            const result = await provDao.updatedProvDao(pid, updated);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar la provincia: ${error.message}`);
        }
    }

    async deleteProv(pid) {
        const provincia = await this.getProvById(pid);
        if (!provincia) throw new Error(`La provincia con ID ${pid} no existe.`);

        try {
            const result = await provDao.deleteProvDao(pid);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar la provincia. ${error.message}`);
        }
    }
}

export default ProvController;