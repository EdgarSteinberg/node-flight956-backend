import cartModels from "../models/cart.js";

class CartDao {

    async getAllCartsDao() {
        return await cartModels.find();
    }

    async getCartByIdDao(cid) {
        return await cartModels.findById(cid).populate('productos.productoSchemaId')
    }

    async createCartDao() {
        return await cartModels.create({})
    }
    // cid:     ID del carrito al que se quiere agregar el producto.
    // pid:     ID del producto seleccionado por el usuario. Este puede ser de tipo vuelo, hotel o paquete.
    // tipo:    Tipo de producto que se está agregando. Puede ser 'vuelos_fli', 'hotel_fli' o 'paquete_fli'.
    // quantity: Cantidad de unidades del producto que el usuario desea agregar al carrito
    async addProductCartDao(cid, pid, referencia, quantity) {
        const cart = await cartModels.findOne({ _id: cid, "productos.productoSchemaId": pid, "productos.referenciaSchema": referencia });

        if (cart) {
            return await cartModels.findOneAndUpdate(
                { _id: cid, "productos.productoSchemaId": pid, "productos.referenciaSchema": referencia },
                { $inc: { "productos.$.quantity": quantity } },
                { new: true }
            );
        } else {
            return await cartModels.findOneAndUpdate(
                { _id: cid },
                {
                    $push: {
                        productos: {
                            productoSchemaId: pid,
                            referenciaSchema: referencia,
                            quantity: quantity
                        }
                    }
                },
                { new: true, upsert: true }
            );
        }
    }

    async deleteProductInCartDao(cid, pid, referencia) {
        return await cartModels.findOneAndUpdate(
            { _id: cid },
            {
                $pull: {
                    productos: {
                        productoSchemaId: pid,
                        referenciaSchema: referencia
                    }
                }
            },
            { new: true }
        );
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