const express = require('express');
const app = express();

//aquí creamos todas nuestras rutas de la aplicación. Esto con el objetivo de no saturar server.js y este lo manda a llamar.
app.use(require('./usuario'));
app.use(require('./login'));







module.exports = app;