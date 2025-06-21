import ProvDao from "../dao/provDao.js";
const provDao = new ProvDao();
import UsersDao from "../dao/usersDao.js";
const userDAo = new UsersDao();
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;

class ProvManager {

    async getAllProv() {
        return await provDao.getAllProvDao();
    }

    async getProvById(piv) {
        try {
            const result = await provDao.getProvByIdDao(piv);
            if (!result) throw new Error("Provincia no encontrada");

            return result;
        } catch (error) {
            throw new Error(`Error al obtener la provincia ${error.message}`)
        }
    }

    async createProv(prov) {
        const { name, country, image, owner } = prov;
        if (!name) throw new Error("Debes agregar la provincia.");

        try {
            const result = await provDao.createProvDao({ name, country, image, owner });
            return result;
        } catch (error) {
            throw new Error(`Error al crear la provincia. ${error.message}`);
        }
    }

    async updatedProv(pid, updated) {
        const provincia = await this.getProvById(pid);
        if (!provincia) throw new Error(`La provincia con ID ${pid} no existe.`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No pueden enviar datos vacíos");
        }

        try {
            const result = await provDao.updatedProvDao(pid, updated);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar la provincia: ${error.message}`);
        }
    }

    async deleteProv(pid) {
        const provincia = await this.getProvById(pid);
        if (!provincia) throw new Error(`La provincia con ID ${pid} no existe.`);

        try {
            const ownerEmail = provincia.owner;
            if (ownerEmail === "admin")
                return await provDao.deleteProvDao(pid);

            const user = await userDAo.getEmailDao(ownerEmail);
            if (user?.role === 'premium') {
                this.sendEmailProductDelete(ownerEmail, pid);
            }

            const result = await provDao.deleteProvDao(pid);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar la provincia. ${error.message}`);
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

export default ProvManager;