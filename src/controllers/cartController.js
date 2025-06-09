import CartDao from "../dao/cartDao.js";
const cartDao = new CartDao();

class CartManager {

    async getAllCarts() {
        try {
            return await cartDao.getAllCartsDao();
        } catch (error) {
            throw new Error(`Error al obtener todos los carritos ${error.message}`);
        }
    }

    async getCartById(cid) {
        try {
            const result = await cartDao.getCartByIdDao(cid);
            if (!result) throw new Error(`El carrito con ID: ${cid} no encontrado`);
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el carrito ${error.message}`);
        }
    }

    async createCart() {
        try {
            return await cartDao.createCartDao();
        } catch (error) {
            throw new Error(`Error al crear el carrito ${error.message}`);
        }
    }

    // async addProductInCart(cid,pid,referencia,quantity){
    //     const cart = await this.getCartById(cid);
    //     if (!cart) throw new Error(`El carrito con ID: ${cid} no encontrado`);

    //     if (!pid) throw new Error("Falta el ID del producto (pid).");

    //     const referenciasPermitidas = ['vuelos_fli', 'hotel_fli', 'paquete_fli'];
    //     if (!referenciasPermitidas.includes(referencia)) {
    //         throw new Error(`El tipo de referencia '${referencia}' no es válido.`);
    //     }

    //     const qty = parseInt(quantity);

    //     if (isNaN(qty) || qty <= 0) {
    //         throw new Error("Cantidad inválida.");
    //     }

    //     try{
    //         const result = await cartDao.addProductCartDao(cid,pid,referencia,quantity);
    //         return result;
    //     }catch(error){
    //         throw new Error(`Error al añadir un producto al carrito ${error.message}`);
    //     }
    // }

    async addProductInCart(cid, pid, referencia, quantity) {
        // Validaciones
        if (!pid) throw new Error("Falta el ID del producto");
        if (!referencia || !["hotel", "vuelo", "paquete"].includes(referencia)) {
            throw new Error("Referencia de producto inválido");
        }
    
        const cantidad = Number(quantity);
        if (isNaN(cantidad) || cantidad <= 0) {
            throw new Error("La cantidad debe ser un número válido y mayor que 0");
        }
    
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado`);
    
        // Ejecución principal
        try {
            const result = await cartDao.addProductToCartDao(cart._id, pid,referencia, cantidad);
            return result;
        } catch (error) {
            console.error("Error en addProductInCart:", error);
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
    



    async deleteProductInCart(cid, pid, referencia) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error(`El carrito con ID: ${cid} no encontrado`);

        if (!pid) throw new Error("Falta el ID del producto (pid).");

        //const referenciasPermitidas = ['vuelos_fli', 'hotel_fli', 'paquete_fli'];
        const referenciasPermitidas = ['vuelo', 'hotel', 'paquete'];

        if (!referenciasPermitidas.includes(referencia)) {
            throw new Error(`El tipo de referencia '${referencia}' no es válido.`);
        }

        try {
            const result = await cartDao.deleteProductInCartDao(cid, pid, referencia);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito ${error.message}`);
        }
    }

    async clearCart(cid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error(`El carrito con ID: ${cid} no encontrado`);

        try {
            const result = await cartDao.clearCartDao(cid);
            return result;
        } catch (error) {
            throw new Error(`Error al vaciar el carrito ${error.message}`);
        }
    }

    async deleteCart(cid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error(`El carrito con ID: ${cid} no encontrado`);

        try {
            const result = await cartDao.deleteCartDao(cid);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar el carrito ${error.message}`);
        }
    }
}

export default CartManager;