import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


import __dirname from './utils/dirname.js';
import userRouter from './routes/userRouter.js';
import hotelRouter from './routes/hotelRouter.js';
import vuelosRouter from './routes/vuelosRouter.js';
import paqueteRouter from './routes/paqueteRouter.js';
import cartRouter from './routes/cartRouter.js'
import provRouter from './routes/provRouter.js';
import ticketRouter from './routes/ticketRouter.js';
import initializatePassport from './config/passportConfig.js';
import { Router } from 'express'
dotenv.config();

const app = express();

// Configura CORS
/* app.use(cors({
    origin: 'http://localhost:3000', // Permite solicitudes solo desde el frontend de React (ajustar según tu URL)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Los métodos que permitirás
    allowedHeaders: ['Content-Type', 'Authorization'], // Los encabezados permitidos
    credentials: true
})); */
app.use(cors({
    origin: [
        'http://localhost:3000',             // desarrollo local
        'https://fligth956.netlify.app'      // producción en Netlify
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


const mongoUri = process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

//MongoDB connect
//const url = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => {
        console.log(`Conexion exitosa a mongodb`);
    })
    .catch(error => {
        console.log("Error de conexion a mongodb", error);
    })

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Sirve TODO public
app.use(express.static(path.join(__dirname, '..', '..', 'public')));
// Si quieres acceso más ordenado (opcional)
//app.use('/image', express.static(path.join(__dirname, '..', '..', 'public', 'image')));

app.use(cookieParser());

//Passport
initializatePassport();
app.use(passport.initialize());


// Documentación Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API venta de pasajes turísticos.',
            description: 'Documentación de mi API con Swagger.'
        },
    },
    apis: [`${__dirname}/../docs/**/*.yaml`],  // Definir las rutas de la documentación Swagger
};
const specs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


//Routes

app.use('/api/users', userRouter);
app.use('/api/hoteles', hotelRouter);
app.use('/api/provincias', provRouter);
app.use('/api/vuelos', vuelosRouter);
app.use('/api/paquetes', paqueteRouter);
app.use('/api/carts', cartRouter);
app.use('/api/ticket', ticketRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
