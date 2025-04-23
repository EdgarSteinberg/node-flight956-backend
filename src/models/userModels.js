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
    role: {type: String, enum: ['admin', 'premium', 'user'], default: 'user'}
});


const userModel = mongoose.model(userCollection, userSchema);

export default userModel;


/*
  const HotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  pricePerNight: Number,
  amenities: [String],
  images: [String],
  availableRooms: Number
});

const FlightSchema = new mongoose.Schema({
  airline: String,
  origin: String,
  destination: String,
  departureTime: Date,
  arrivalTime: Date,
  price: Number,
  seatsAvailable: Number,
  flightCode: String
});
 */