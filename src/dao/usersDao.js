import userModel from "../models/userModels.js";

class UsersDao {

    async getAllUserDao() {
        return await userModel.find().lean();  // Devuelve los usuarios como un objeto plano
    }

    async getUserByIdDao(uid) {
        return await userModel.findById(uid).populate('ticket').lean();  // Devuelve un usuario por su ID
    }

    async getEmailDao(email) {
        return await userModel.findOne({ email }).lean();
    }

    async createUserDao(user) {
        return await userModel.create(user);  // Crea un nuevo usuario
    };

    // actualiza el role
    async updatedUserDao(uid, updated) { // actualiza el role
        return await userModel.findByIdAndUpdate(
            uid,
            { $set: updated },  // Corrección: $set: updated
            { new: true }  // Devuelve el documento actualizado
        );
    }

    async uploadDocsDao(uid, docs) {
        return await userModel.findByIdAndUpdate(
            uid,
            { $push: { documents: { $each: docs } } },
            { new: true }
        )
    }

    async updatedConnectionDao(uid, connection) {
        return await userModel.findByIdAndUpdate(
            uid,
            { $set: { last_connection: connection } },
            { new: true }
        );
    }

    async deleteUserLastConnectionDao() {
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - 30); // Fecha actual - 15 minutos atrás

        return await userModel.deleteMany({
            last_connection: { $lt: limitDate }
        });
    }


    async deleteUserDao(uid) {
        return await userModel.deleteOne({ _id: uid });  // Elimina un usuario por su ID
    }
}

export default UsersDao;
