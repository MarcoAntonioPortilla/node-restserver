//DECLARACIONES
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//indicamos que utilizaremos el archivo usuario.js
app.use(require('./routes/usuario'));









//conexión a la BD
//En lugar de process.env.URLDB, se puede poner la cadena directa de la BD: 'mongodb://localhost:27017/cafe'
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base de Datos ONLINE');
    });








//configuración del puerto del servidor
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});