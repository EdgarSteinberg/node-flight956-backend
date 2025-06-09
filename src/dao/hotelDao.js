import hotelModel from "../models/hotelModel.js";

class HotelDao {

    async getAllHotelDao() {
        return await hotelModel.find().populate('location').lean();
    }


    async getHotelByIdDao(hid) {
        return await hotelModel.findById(hid).populate('location');
    }

    async createHotelDao(hotel) {
        return await hotelModel.create(hotel);
    }

    async updateHotelDao(hid, updated) {
        return await hotelModel.findByIdAndUpdate(
            hid,
            { $set: updated },
            { new: true }
        )
    }

    async deleteHotelDao(hid) {
        const hotel = await hotelModel.findById(hid).populate('location');
        if (!hotel) throw new Error("Hotel no encontrado");
        
        await hotelModel.deleteOne({ _id: hid });
        return hotel;
    }
};

export default HotelDao