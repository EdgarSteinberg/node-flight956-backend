import vuelosModels from "../models/vuelos.js";

class VuelosDao {

    async getAllVuelosDao() {
        return await vuelosModels.find().lean();
    };

    async getVuelosByIdDao(vid) {
        return await vuelosModels.findById(vid).populate("origen destino");
    }
    
    async createVuelosDao(vuelo) {
        return await vuelosModels.create(vuelo);
    };

    async updatedVuelosDao(vid, updated) {
        return await vuelosModels.findByIdAndUpdate(
            vid,
            { $set: updated },
            { new: true }
        );
    };

    async deleteVuelosDao(vid) {
        return await vuelosModels.deleteOne({ _id: vid });
    }

}

export default VuelosDao;