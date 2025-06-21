import mongoose from "mongoose";

const vuelosCollection = "vuelos_fli";

const vuelosSchema = new mongoose.Schema({
    empresa: { type: String, required: true }, // Aerolínea: Ej. "Aerolíneas Argentinas"

    origen: { type: mongoose.Schema.Types.ObjectId, ref: "prov_fli", required: true },  // Ciudad o aeropuerto de salida
    destino: { type: mongoose.Schema.Types.ObjectId, ref: "prov_fli", required: true }, // Ciudad o aeropuerto de llegada

    vuelo_ida: { type: Date, required: true },     // Fecha y hora de salida
    vuelo_vuelta: { type: Date },                  // Solo si es ida y vuelta

    precio: { type: Number, required: true, min: 0 }, // Precio del vuelo
    duracion: { type: String }, // Ej. "2h 45m"

    clase: {
        type: String,
        enum: ["Económica", "Ejecutiva", "Primera"],
        default: "Económica"
    },

    asientos_disponibles: { type: Number, default: 0 }, // Por si manejás stock de asientos

    incluye_equipaje: { type: Boolean, default: false }, // Si incluye valija en bodega

    // Relaciones (opcional)
    pasajeros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users_fli' }], // Usuarios con reserva
    owner: { type: String, deafult: 'admin' }
});

const vuelosModels = mongoose.model(vuelosCollection, vuelosSchema);

export default vuelosModels;
