import provModels from "../models/provModel.js";
import vuelosModels from "../models/vuelosModels.js";

class VuelosDao {

    async buscarVueloProvinciaDao(nombreProvincia) {
        const provincia = await provModels.findOne({ name: nombreProvincia });
    
        return await vuelosModels.find({ destino: provincia._id })
            .populate('destino')    
            .populate('origen');   
    }
    

    async buscarVuelosFiltradosDao({ origen, destino, vuelo_ida, vuelo_vuelta }) {
        const filtro = {};

        if (origen) filtro.origen = origen;
        if (destino) filtro.destino = destino;

        if (vuelo_ida && vuelo_vuelta) {
            filtro.vuelo_ida = {
                $gte: new Date(vuelo_ida),
                $lte: new Date(vuelo_vuelta),
            };
        } else if (vuelo_ida) {
            filtro.vuelo_ida = { $gte: new Date(vuelo_ida) };
        }

        return await vuelosModels
            .find(filtro)
            .populate("origen destino pasajeros")
            .lean();
    }


    async getAllVuelosDao() {
        return await vuelosModels
            .find()
            .populate("origen destino pasajeros") // ¡agregamos pasajeros!
            .lean();
    }

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