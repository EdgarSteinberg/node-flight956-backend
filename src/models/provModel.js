import mongoose from "mongoose";

const provCollection = 'prov_fli';

const provSchema = new mongoose.Schema({
    image: { type: [String] },
    name: {type: String , required: true},
    country: {type: String, required: true, default: "Argentina"}
});

const provModels = mongoose.model(provCollection,provSchema);

export default provModels;