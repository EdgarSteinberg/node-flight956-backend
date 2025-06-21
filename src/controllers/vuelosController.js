import VuelosDao from "../dao/vuelosDAO.js";
const vuelosDao = new VuelosDao();

import UsersDao from "../dao/usersDao.js";
const userDao = new UsersDao();

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;

class VuelosManager {

    async getAllVuelos() {
        return await vuelosDao.getAllVuelosDao();
    }

    async buscarVueloProvincia(nombreProvincia) {
        if (!nombreProvincia) throw new Error(`Nombre de provincia no encontrado`)
        try {
            const vuelos = await vuelosDao.buscarVueloProvinciaDao(nombreProvincia);

            if (vuelos.length === 0) {
                throw new Error(`No se encontraron vuelos para la provincia: ${nombreProvincia}`);
            }

            return vuelos;
        } catch (error) {
            throw new Error(`Error al obtener el vuelo por provincia ${error.message}`)
        }
    }

    async buscarVuelosFiltrados(busqueda) {
        const { origen, destino, vuelo_ida, vuelo_vuelta } = busqueda;

        if (!origen || !destino || !vuelo_ida) {
            throw new Error("Faltan datos obligatorios para buscar vuelos.");
        }
        try {
            const result = await vuelosDao.buscarVuelosFiltradosDao({ origen, destino, vuelo_ida, vuelo_vuelta })
            return result;
        } catch (error) {
            throw new Error(`Error al obtener los vuelos!`)
        }
    }

    async getVuelosById(vid) {
        try {
            const result = await vuelosDao.getVuelosByIdDao(vid);
            if (!result) throw new Error(`El vuelo con ID: ${vid} no se encuentra`);

            return result;
        } catch (error) {
            throw new Error(`Error al obtener los vuelos ${error.message}`);
        }
    }

    async createVuelos(vuelo) {
        const { empresa, origen, destino, vuelo_ida, vuelo_vuelta, precio, duracion, clase, asientos_disponibles, incluye_equipaje, pasajeros, owner } = vuelo;

        if (!empresa || !origen || !destino || !vuelo_ida || !duracion || !clase || typeof precio !== 'number' || typeof asientos_disponibles !== 'number' ||
            !Array.isArray(pasajeros)
        ) {
            throw new Error("Faltan campos obligatorios o tienen el tipo incorrecto");
        }
        try {
            const result = await vuelosDao.createVuelosDao({ empresa, origen, destino, vuelo_ida, vuelo_vuelta, precio, duracion, clase, asientos_disponibles, incluye_equipaje, pasajeros, owner })
            return result;
        } catch (error) {
            throw new Error(`Error al crear los vuelos ${error.message}`);
        }
    }

    async updatedVuelos(vid, updated) {
        const vuelo = await this.getVuelosById(vid);
        if (!vuelo) throw new Error(`El vuelo con ${vid} no se encuentra`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No puedes enviar datos vacios");
        }
        try {
            const result = await vuelosDao.updatedVuelosDao(vid, updated);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar el vuelo ${error.message}`);
        }
    }


    async deleteVuelos(vid) {
        const vuelo = await this.getVuelosById(vid);
        if (!vuelo) throw new Error(`El vuelo con ${vid} no se encuentra`);
        try {

            const ownerEmail = vuelo.owner;
            if (ownerEmail === "admin")
                return await vuelosDao.deleteVuelosDao(vid);

            const user = await userDao.getEmailDao(ownerEmail);
            if (user?.role === 'premium') {
                this.sendEmailProductDelete(ownerEmail, vid);

                const result = await vuelosDao.deleteVuelosDao(vid);
                return result;
            }
        } catch (error) {
            throw new Error(`Error al actualizar el vuelo ${error.message}`);
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

export default VuelosManager;