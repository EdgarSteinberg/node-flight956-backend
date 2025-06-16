import mongoose from "mongoose";

const userCollection = "users_fli";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, min: 18, required: true },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    role: { type: String, enum: ['admin', 'premium', 'user'], default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'cart_fli' },
    documents: [
        {
            name: { type: String, required: true },      // nombre original del archivo
            reference: { type: String, required: true }, // ruta o URL del archivo
        }
    ],
    last_connection: { type: Date, default: Date.now },
    ticket: {type : mongoose.Schema.Types.ObjectId, ref: 'ticket_fli'}
});


const userModel = mongoose.model(userCollection, userSchema);

export default userModel;


