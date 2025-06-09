import mongoose from "mongoose";

const cartCollection = "cart_fli";


const cartSchema = new mongoose.Schema({
  productos: [
    {
      productoPaquete: { type: mongoose.Schema.Types.ObjectId, ref: 'paquete_fli' },
      productoHotel: { type: mongoose.Schema.Types.ObjectId, ref: 'hotel_fli' },
      productoVuelo: { type: mongoose.Schema.Types.ObjectId, ref: 'vuelos_fli' },
      quantity: { type: Number, default: 1 }
    }
  ]
});



const cartModels = mongoose.model(cartCollection, cartSchema);
export default cartModels;
