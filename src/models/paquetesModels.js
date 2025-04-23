import mongoose from "mongoose";

const paqueteCollection = "paquete_fli";

const paqueteSchema = new mongoose.Schema({
    image: { type: [String] },
    vuelo: { type: mongoose.Schema.Types.ObjectId, ref: 'vuelos_fli' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'hotel_fli' },
    origen_salida: { type: mongoose.Schema.Types.ObjectId, ref: 'prov_fli' },
    destino: { type: mongoose.Schema.Types.ObjectId, ref: 'prov_fli' },
    desde_fecha: { type: Date },
    hasta_fecha: { type: Date },
    total_paquete: { type: Number }
});

const paqueteModels = mongoose.model(paqueteCollection, paqueteSchema);

export default paqueteModels;
