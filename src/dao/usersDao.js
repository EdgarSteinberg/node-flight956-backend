import userModel from "../models/userModels.js";

class UsersDao {

    async getAllUserDao() {
        return await userModel.find().lean();  // Devuelve los usuarios como un objeto plano
    }

    async getUserByIdDao(uid) {
        return await userModel.findById(uid);  // Devuelve un usuario por su ID
    }

    async getEmailDao(email){
        return await userModel.findOne({email}).lean();
    }

    async createUserDao(user) {
        return await userModel.create(user);  // Crea un nuevo usuario
    };

    async updatedUserDao(uid, updated) {
        return await userModel.findByIdAndUpdate(
            uid, 
            { $set: updated },  // Corrección: $set: updated
            { new: true }  // Devuelve el documento actualizado
        );
    }

    async deleteUserDao(uid) {
        return await userModel.deleteOne({ _id: uid });  // Elimina un usuario por su ID
    }
}

export default UsersDao;
