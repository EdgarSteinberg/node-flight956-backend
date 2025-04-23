import paqueteModels from "../models/paquetesModels.js";

class PaqueteDao {

    async getAllPaqueteDao() {
        return await paqueteModels.find().lean();
    }

    async getPaqueteByIdDao(pid) {
        return await paqueteModels.findById(pid)
            .populate('vuelo')
            .populate('hotel')
            .populate('origen_salida')
            .populate('destino');
    }

    async createPaqueteDao(paquete) {
        return await paqueteModels.create(paquete);
    }

    async updatedPaqueteDao(pid, updated) {
        return await paqueteModels.findByIdAndUpdate(
            pid,
            { $set: updated },
            { new: true }
        );
    }

    async deletePaqueteDao(pid) {
        return await paqueteModels.deleteOne({ _id: pid });
    }

}

export default PaqueteDao;