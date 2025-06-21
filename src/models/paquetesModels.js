import mongoose from "mongoose";

const paqueteCollection = "paquete_fli";

const paqueteSchema = new mongoose.Schema({
    destino: { type: mongoose.Schema.Types.ObjectId, ref: 'prov_fli' },
    vuelo: { type: mongoose.Schema.Types.ObjectId, ref: 'vuelos_fli' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'hotel_fli' },
    desde_fecha: { type: Date },
    hasta_fecha: { type: Date },
    owner: {type: String, default: 'admin'}
});

const paqueteModels = mongoose.model(paqueteCollection, paqueteSchema);

export default paqueteModels;


  
