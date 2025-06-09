import multer from 'multer';
import path from 'path';
import fs from 'fs';
import __dirname from './dirname.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = '';

    if (file.fieldname === 'provincia') {
      folder = 'provincias';
    } else if (file.fieldname === 'hotel') {
      folder = 'hoteles';
    } else if(file.fieldname === 'docs') {
      folder = 'docs'
    }

    const fullPath = path.join(__dirname, '..', '..', 'public', 'image', folder);

    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const uploader = multer({ storage });

export default uploader;



// Usás multer.diskStorage() → ✔️

// Evaluás el file.fieldname para decidir la carpeta → ✔️

// Creás el path completo a public/image/<carpeta> → ✔️

// Usás fs.mkdirSync(..., { recursive: true }) para asegurarte de que la carpeta exista → ✔️

// Usás file.originalname para el nombre del archivo → ✔️

// Exportás el uploader para usarlo en rutas → ✔️