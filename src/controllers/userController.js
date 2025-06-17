import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { createHash, isValidPassword } from "../utils/bcrypt.js";

import UsersDao from "../dao/usersDao.js";
const userService = new UsersDao();

import CartManager from './cartController.js';
const cartService = new CartManager();

import UserDto from '../dao/dto/userDto.js';

dotenv.config();

const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const SECRET_KEY = process.env.SECRET_KEY;

class UserManager {

    async getAllUsers() {
        const users = await userService.getAllUserDao();
        return users.map(user => new UserDto(user)); // <-- Aplica DTO a cada usuario
    };

    async getUserById(uid) {
        try {
            const result = await userService.getUserByIdDao(uid);
            if (!result) throw new Error("Usuario no encontrado");
            return new UserDto(result); // <-- Aquí aplicás el DTO
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    };

    async getUserByEmail(email) {
        try {
            const user = await userService.getEmailDao(email);
            if (!user) throw new Error(`Usuario con email: ${email} no encontrado.`);
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    };


    async registerUser(user) {
        const { first_name, last_name, age, email, password } = user;

        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error("Todos los campos son obligatorios");
        }
        if (password.length < 5) throw new Error("La contraseña debe tener al menos 5 caracteres");

        try {
            const cart = await cartService.createCart();
            const result = await userService.createUserDao({
                first_name,
                last_name,
                age,
                email,
                password: createHash(password),
                cart
            });

            return result;
        } catch (error) {
            throw new Error(`Error al registrar el usuario, ${error.message}`);
        }
    };

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
    };

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
    };

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
    };

    async uploadDocs(uid, docs) {
        const user = await this.getUserById(uid);
        if (!user) throw new Error(`Usuario con ID: ${uid} no encontrado.`);

        if (!Array.isArray(docs) || docs.length === 0) {
            throw new Error(`Debes cargar al menos un documento válido.`);
        }

        // Validar estructura de cada documento
        const invalidDocs = docs.filter(doc => !doc.name || !doc.reference);
        if (invalidDocs.length > 0) {
            throw new Error(`Todos los documentos deben tener 'name' y 'reference'.`);
        }

        try {
            const documents = await userService.uploadDocsDao(uid, docs);
            return documents;
        } catch (error) {
            throw new Error(`Error al cargar los documentos: ${error.message}`);
        }
    };

    async updateLastConnection(uid, connection) {
        const user = await this.getUserById(uid);
        if (!user) throw new Error(`Usuario con ID: ${uid} no encontrado.`);

        if (!connection) throw new Error(`Falta la conexión del usuario.`);

        try {
            const result = await userService.updatedConnectionDao(uid, connection);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar la conexión del usuario: ${error.message}`);
        }
    };

    async deleteUserLastConnection() {
        try {
            const result = await userService.deleteUserLastConnectionDao();
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar usuarios inactivos: ${error.message}`);
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
    };


    //Enviar Email 
    async sendEmail(email) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: EMAIL,
                pass: PASS
            }
        });
        const user = await userService.getEmailDao(email);
        if (!user) {
            throw new Error('Correo electronico no encontrado')
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`Este el token desde el SendEmail`, token);

        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
            <div style="
                max-width: 480px;
                margin: 0 auto;
                padding: 24px;
                font-family: Arial, sans-serif;
                color: #333333;
                background: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                ">
                <h2 style="margin-top: 0;">Solicitud de recuperación de contraseña</h2>

                <p style="line-height: 1.5;">
                Hemos recibido una petición para cambiar la contraseña de tu cuenta.
                Haz clic en el botón de abajo para continuar.
                </p>

                <p style="line-height: 1.5;">
                Si tú no hiciste esta solicitud, ignora este correo ✌️.
                </p>

                <!-- Botón “false but handsome”: en realidad es un <a> -->
                <a href="http://localhost:3000/reset-password?token=${token}"
                style="
                    display: inline-block;
                    padding: 12px 24px;
                    margin: 16px 0;
                    text-decoration: none;
                    background: #ffffff;
                    color: #000000;
                    border: 2px solid #00aaff; /* celeste */
                    border-radius: 7px;
                    font-weight: bold;
                    ">
                Realizar cambio de contraseña
                </a>

                <p style="font-size: 14px; color: #666666;">
                Este enlace es válido por 1 hora.
                </p>

                <p style="margin-bottom: 0;">
                ¡Gracias!<br/>
                El equipo de soporte
                </p>
            </div>
            `
        });


        return token;
    }

    async resetPassword(token, newPassword) {
        try {
            const data = jwt.verify(token, SECRET_KEY);
            const { email } = data;
            const user = await userService.getEmailDao(email);

            if (!email) {
                throw new Error('La nueva contraseña no puede ser la misma que la anterior');
            }

            const hashedPassword = await createHash(newPassword);
            await userService.updatedUserDao(user._id, { password: hashedPassword })
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
            } else {
                throw error;
            }
        }
    }

}


export default UserManager;