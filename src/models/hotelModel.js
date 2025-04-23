import mongoose from 'mongoose';

const hotelCollection = 'hotel_fli';

const hotelSchema = new mongoose.Schema({
    image: { type: [String] },
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "prov_fli", required: true },
    description: { type: String, required: true },
    stars: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
    nightPrice : { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    breakfastIncluded: { type: Boolean, default: false }
});

const hotelModel = mongoose.model(hotelCollection, hotelSchema);

export default hotelModel;
