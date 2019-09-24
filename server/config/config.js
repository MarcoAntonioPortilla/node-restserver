//===========================
// Puerto
//===========================
process.env.PORT = process.env.PORT || 3000;



//===========================
// Entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



//===========================
// Vencimiento del Token
//===========================
//60 segundos
//60 minutos
//24 horas
//30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



//===========================
// SEED de autenticación
//===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';




//===========================
// Base de Datos
//===========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:wJp2wg9tRrR9HK93@cluster0-kzxyv.mongodb.net/cafe';
}

process.env.URLDB = urlDB;





//===========================
// Google client ID
//===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '535699508092-lq2k7rij66jnoa7d6f25trtcfsrcm2b9.apps.googleusercontent.com';