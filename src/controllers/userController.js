import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from "../utils/bcrypt.js";

import UsersDao from "../dao/usersDao.js";
const userService = new UsersDao();

class UserManager {

    async getAllUsers() {
        return await userService.getAllUserDao();
    }

    async getUserById(uid) {
        try {
            const result = await userService.getUserByIdDao(uid);
            if(!result) throw new Error("Usuario no encontrado")
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el usuario, ${error.message}`);
        }
    }

    async registerUser(user) {
        const { first_name, last_name, age, email, password } = user;

        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error("Todos los campos son obligatorios");
        }
        if (password.length < 5) throw new Error("La contraseña debe tener al menos 5 caracteres");

        try {

            const result = await userService.createUserDao({
                first_name,
                last_name,
                age,
                email,
                password: createHash(password)
            });
            return result;
        } catch (error) {
            throw new Error(`Error al registrar el usuario, ${error.message}`);
        }
    }

    async loginUser(email, password) {
        if (!email || !password) throw new Error("Falta el email o password");

        try {
            // Buscamos el usuario con el email y password
            const user = await userService.getEmailDao(email);
            if (!user) throw new Error("Credenciales inválidas");

            // Verificamos si no se encontró un usuario
            if (isValidPassword(user, password)) {
                delete user.password;
                return jwt.sign(user, "secretCookie", { expiresIn: "1h" });
            };

            throw new Error("Credenciales inválidas")

        } catch (error) {
            throw new Error(`El usuario no pudo loggearse: ${error.message}`);
        }
    }

    async updatedUser(uid, updated) {
        const user = await this.getUserById(uid);
        if (!user) throw new Error(`El usuario con ID ${uid} no existe.`);

        if (!updated || Object.keys(updated).length === 0) {
            throw new Error("No puedes enviar datos vacíos");
        }

        try {
            const result = await userService.updatedUserDao(uid, updated);
            return result;
        } catch (error) {
            throw new Error(`No se pudo actualizar el usuario, ${error.message}`);
        }
    }

    async updatedRole(uid) {
        const user = await this.getUserById(uid);
        if (!user) throw new Error(`El usuario con ID ${uid} no existe.`);

        const newRole = user.role === 'user' ? 'premium' : 'user';

        try {
            await userService.updatedUserDao(uid, { role: newRole });
            return `Rol actualizado a ${newRole}`;
        } catch (error) {
            throw new Error(`Error al actualizar el Role ${error.message}`);
        }
    }

    async deleteUser(uid) {
        const user = await this.getUserById(uid); 
        if (!user) throw new Error(`El usuario con ID ${uid} no existe.`);
        try {
            await userService.deleteUserDao(uid);
            return "Usuario Eliminado Correctamente";
        } catch (error) {
            throw new Error(`Error al eliminar el usuario, ${error.message}`);
        }
    }
}


export default UserManager;