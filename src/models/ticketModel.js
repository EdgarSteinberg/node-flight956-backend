import mongoose from "mongoose";

const ticketCollection = 'ticket_fli';

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user_fli', required: true },
  cart: { type: mongoose.Types.ObjectId, ref: 'cart_fli', required: true }, // opcional, si querés trazabilidad
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, required: true }, // para trazabilidad interna
      tipo: { type: String, enum: ['paquete', 'hotel', 'vuelo'], required: true },
      nombre: { type: String, required: true },
      precioUnitario: { type: Number, required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  codigo: { type: String, required: true }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
