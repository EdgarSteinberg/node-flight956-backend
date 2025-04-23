import mongoose from "mongoose";

const cartCollection = "cart_fli";

const cartSchema = new mongoose.Schema({
  productos: [
    {
      productoSchemaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "productos.referenciaSchema" // ¡Dinamismo! Mira el campo "tipo"
      },
      referenciaSchema: {
        type: String,
        required: true,
        enum: ['vuelos_fli', 'hotel_fli', 'paquete_fli'] // Solo aceptamos estas 3
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
});

const cartModels = mongoose.model(cartCollection, cartSchema);
export default cartModels;
