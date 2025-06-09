import HotelDao from "../dao/hotelDao.js";
const hotelDao = new HotelDao();

class HotelesManager {
    
    async getAllHoteles() {
        return await hotelDao.getAllHotelDao();
    }

    async getHotelById(hid) {
        try {
            const result = await hotelDao.getHotelByIdDao(hid);
            if (!result) throw new Error("Hotel no encontrado");
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el hotel: ${error.message}`);
        }
    }

    async createHotel(hotel) {
        const { image, name, location, description, stars,numberOfNights, nightPrice, price, breakfastIncluded } = hotel;

        if (!name || !location || !description || !stars || !nightPrice || !price || !image || !numberOfNights ) {
            throw new Error("Todos los campos son obligatorios!");
        }

        try {
            const result = await hotelDao.createHotelDao({
                image,
                name,
                location,
                description,
                stars,
                numberOfNights,
                nightPrice,
                price,
                breakfastIncluded
            });
            return result;
        } catch (error) {
            throw new Error(`Error al crear el hotel: ${error.message}`);
        }
    }

    async updatedHotel(hid, updated) {
        const hotel = await this.getHotelById(hid);
        if (!hotel) throw new Error(`El Hotel con ID ${hid} no existe.`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("Falta el campo para actualizar, no puedes enviar datos vacíos");
        }

        try {
            const result = await hotelDao.updateHotelDao(hotel, updated);
            return result;
        } catch (error) {
            throw new Error(`No se pudo actualizar el hotel: ${error.message}`);
        }
    }

    async deleteHotel(hid) {
        const hotel = await this.getHotelById(hid);
        if (!hotel) throw new Error(`El Hotel con ID ${hid} no existe.`);
        try {
            const result = await hotelDao.deleteHotelDao(hid);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el hotel: ${error.message}`);
        }
    }
    
}

export default HotelesManager;
