import HotelDao from "../dao/hotelDao.js";
const hotelDao = new HotelDao();
import nodemailer from 'nodemailer';
import UsersDao from "../dao/usersDao.js";
const userDao = new UsersDao();
import dotenv from 'dotenv';

dotenv.config();

const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;

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
        const { image, name, location, description, stars, numberOfNights, nightPrice, price, breakfastIncluded, owner } = hotel;

        if (!name || !location || !description || !stars || !nightPrice || !price || !image || !numberOfNights) {
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
                breakfastIncluded,
                owner
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
            const ownerEmail = hotel.owner;
            if (ownerEmail === "admin")
                return await hotelDao.deleteHotelDao(hid);

            const user = await userDao.getEmailDao(ownerEmail);
            if (user?.role === 'premium') {
                this.sendEmailProductDelete(ownerEmail, hid);
            }
           
            const result = await hotelDao.deleteHotelDao(hid);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el hotel: ${error.message}`);
        }
    }

    async sendEmailProductDelete(email, productId) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: EMAIL,
                pass: PASS
            }
        });

        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Eliminación de Producto',
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
                        <h1>Notificación de Eliminación de Producto</h1>
                        <p>El producto con ID ${productId} ha sido eliminado de la plataforma.</p>
                        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
                        <p>Gracias,</p>
                        <p>El equipo de soporte </p>
                        </div>`,
        });

    }

}

export default HotelesManager;
