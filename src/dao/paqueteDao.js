import provModels from "../models/provModel.js";
import paqueteModels from "../models/paquetesModels.js";
 
class PaqueteDao {

    async getAllPaqueteDao() {
        return await paqueteModels.find()
            .populate('vuelo')
            .populate('hotel')
            .populate('destino')
            .lean();
    }

    async buscarPaquetePorProvinciaDao(nombreProvincia) {
        const provincia = await provModels.findOne({ name: nombreProvincia })

        return await paqueteModels.find({ destino: provincia._id })
         
            .populate('destino')
            .populate('vuelo')
            .populate('hotel')
    }

    async buscarPaquetesFiltradosDao({ destino, desde_fecha, hasta_fecha }) {
        const filtro = {};

        if (destino) filtro.destino = destino;

        if (desde_fecha && hasta_fecha) {
            filtro.$and = [
                { desde_fecha: { $lte: new Date(hasta_fecha) } },
                { hasta_fecha: { $gte: new Date(desde_fecha) } }
            ];
        } else if (desde_fecha) {
            filtro.hasta_fecha = { $gte: new Date(desde_fecha) };
        } else if (hasta_fecha) {
            filtro.desde_fecha = { $lte: new Date(hasta_fecha) };
        }

        return await paqueteModels
            .find(filtro)
            .populate("destino vuelo hotel")
            .lean();
    }



    // async getPaqueteByIdDao(pid) {
    //     return await paqueteModels.findById(pid)
    //         .populate('vuelo')
    //         .populate('hotel')
    //         .populate('destino');

    // }

    async getPaqueteByIdDao(pid) {
    return await paqueteModels.findById(pid)
        .populate({
            path: 'vuelo',
            populate: [
                { path: 'origen' },
                { path: 'destino' }
            ]
        })
        .populate('hotel')
        .populate('destino')
        .lean();
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