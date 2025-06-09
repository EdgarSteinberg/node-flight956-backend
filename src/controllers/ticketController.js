import TicketDao from "../dao/ticketDao.js";
const ticketDao = new TicketDao();

import UserManager from "./userController.js";
const userService = new UserManager();

import CartManager from "./cartController.js";
const cartService = new CartManager();

class TicketManager {

    async getAllTicket() {
        return await ticketDao.getAllTicketDao();
    }

    async getTicketById(tid) {
        try {
            const ticketId = await ticketDao.getTicketByIdDao(tid);
            if (!ticketId) throw new Error(`Error al obtener el ticket con ID ${tid} ${error.message}`);
            return ticketId;
        } catch (error) {
            throw new Error(`Error al obtener el ticket con ID ${tid} ${error.message}`);
        }
    }

    async createTicket(ticket) {
        const { userId, cartId } = ticket;

        try {
            const user = await userService.getUserById(userId);
            if (!user) throw new Error(`Usuario con ID: ${userId} no encontrado`);

            const cart = await cartService.getCartById(cartId)
            if (!cart) throw new Error(`Carrito con ID: ${cartId} no encontrado`);

            // Desnormalizar productos
            const productosTicket = cart.productos.map(item => {
                let producto;  // Aquí guardamos el objeto completo del producto (vuelo, hotel o paquete)
                let tipo;      // Para saber qué tipo de producto es (vuelo, hotel o paquete)
                let precioUnitarioPaquete = 0;  // Para calcular el precio en el caso del paquete (que es vuelo + hotel)

                if (item.productoPaquete) {
                    producto = item.productoPaquete;
                    tipo = 'paquete';

                    // Precio total del paquete = vuelo + hotel
                    const vueloPrecio = producto.vuelo?.precio || 0;
                    const hotelPrecio = producto.hotel?.price || 0;
                    precioUnitarioPaquete = vueloPrecio + hotelPrecio;

                } else if (item.productoHotel) {
                    producto = item.productoHotel;
                    tipo = 'hotel';

                } else if (item.productoVuelo) {
                    producto = item.productoVuelo;
                    tipo = 'vuelo';
                }

                // Lo que devuelve el map para cada producto
                return {
                    producto: producto._id,  // Solo la referencia al _id para el ticket
                    tipo,                   // Importante para saber qué tipo es (vuelo, hotel, paquete)
                    nombre: `Producto tipo ${tipo}`,  // Nombre legible que incluye el tipo (puede ser para UI o schema)
                    precioUnitario: tipo === 'paquete' ? precioUnitarioPaquete : (producto.precio || producto.price),  // Precio correcto según tipo
                    quantity: item.quantity  // Cantidad pedida
                };
            });


            // Calcular total
            const total = productosTicket.reduce((acc, p) => acc + (p.precioUnitario * p.quantity), 0);

            // Generar código único
            const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();

            // Armar ticket
            const newTicket = {
                user: user._id,
                cart: cart._id,
                productos: productosTicket,
                total,
                codigo
            };

            const result = await ticketDao.createTicketDao(newTicket);
            return result;

        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }


    async deleteTicket(tid) {
        try {
            const ticketId = this.getTicketById(tid)
            if (!ticketId) throw new Error(`Error al obtener el ticket con ID ${tid} ${error.message}`);

            const result = await ticketDao.deleteTicketDao(tid);
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el ticket con ID ${tid} ${error.message}`);
        }
    }



}

export default TicketManager;
