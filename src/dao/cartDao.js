import cartModels from "../models/cartModel.js";

class CartDao {

    async getAllCartsDao() {
        return await cartModels.find();
    }


    async getCartByIdDao(cid) {
        return await cartModels.findById(cid)
            .populate({
                path: 'productos.productoPaquete',
                populate: [
                    {
                        path: 'vuelo',
                        model: 'vuelos_fli',
                        populate: [
                            { path: 'origen', model: 'prov_fli' },
                            { path: 'destino', model: 'prov_fli' }
                        ]
                    },
                    {
                        path: 'hotel',
                        model: 'hotel_fli',
                        populate: { path: 'location', model: 'prov_fli' }
                    },
                    {
                        path: 'destino',
                        model: 'prov_fli'
                    }
                ]
            })
            .populate({
                path: 'productos.productoHotel',
                model: 'hotel_fli',
                populate: { path: 'location', model: 'prov_fli' }
            })
            .populate({
                path: 'productos.productoVuelo',
                model: 'vuelos_fli',
                populate: [
                    { path: 'origen', model: 'prov_fli' },
                    { path: 'destino', model: 'prov_fli' }
                ]
            })
            .populate({ path: 'productos.productoHotel', model: 'hotel_fli' })
            // .populate({ path: 'productos.productoVuelo', model: 'vuelos_fli', })
            .populate({
                path: 'productos.productoVuelo',
                populate: [
                    { path: 'destino' },
                    { path: 'origen' }
                ]
            })
            .lean(); // <- .lean() SIEMPRE AL FINAL, después del populate
    }


    async createCartDao() {
        return await cartModels.create({})
    }



    async addProductToCartDao(cid, pid, referencia, quantity = 1) {
        const cart = await cartModels.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        const fieldMap = {
            hotel: "productoHotel",
            vuelo: "productoVuelo",
            paquete: "productoPaquete"
        };

        const campoProducto = fieldMap[referencia];
        if (!campoProducto) throw new Error("Tipo de producto inválido");

        // Buscamos si el producto ya está en el carrito
        const existingItemIndex = cart.productos.findIndex(p => p[campoProducto]?.toString() === pid);

        if (existingItemIndex !== -1) {
            cart.productos[existingItemIndex].quantity += quantity;
        } else {
            const nuevoProducto = {
                quantity,
                [campoProducto]: pid
            };
            cart.productos.push(nuevoProducto);
        }

        return await cart.save();
    }


    async deleteProductInCartDao(cid, pid, referencia) {
        const fieldMap = {
            hotel: "productoHotel",
            vuelo: "productoVuelo",
            paquete: "productoPaquete"
        };
    
        const campoProducto = fieldMap[referencia];
        if (!campoProducto) throw new Error("Tipo de producto inválido");
    
        const cart = await cartModels.findByIdAndUpdate(
            cid,
            {
                $pull: {
                    productos: { [campoProducto]: pid }
                }
            },
            { new: true } // Te devuelve el carrito actualizado
        );
    
        if (!cart) throw new Error("Carrito no encontrado");
    
        return cart;
    }


    async clearCartDao(cid) {
        return await cartModels.findOneAndUpdate(
            { _id: cid },
            { $set: { productos: [] } },
            { new: true }
        );
    }

    async deleteCartDao(cid) {
        return await cartModels.deleteOne({ _id: cid })
    }
}

export default CartDao;