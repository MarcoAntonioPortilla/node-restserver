const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');



//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    //Si no hay archivo
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }


    //Valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')

            }
        })
    }




    //Si hay archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.'); //le asigna a la variable nombreCortado dos valores, el nombre del archivo y su extensión. Ej. ['nombreArchivo', 'jpg']
    let extension = nombreCortado[nombreCortado.length - 1]; //el length obtiene el total de elementos del arreglo que sería 2 y le restamos 1 nos arroja la posición del atributo del arrego jpg


    //Validamos las extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extensionesValidas.indexOf(extension) < 0) { //el indexOf compara en cada elemento del arreglo 'extensionesValidas' el contenido de la variable extension. Si es menor que 0 no encontró nada
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }


    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    //Se sube el archivo al servidor
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aquí cargamos la imagen    
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });


});









//Función que actualizan la foto del usuario en la colección usuario
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }



        //eliminamos una imagen anterior en caso de que exista
        borraArchivo(usuarioDB.img, 'usuarios');



        //guardamos la imagen
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })



    });
}




//Función que actualizan la foto del producto en la colección producto
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }



        //eliminamos una imagen anterior en caso de que exista
        borraArchivo(productoDB.img, 'productos');



        //guardamos la imagen
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })



    });
}



function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); //los primeros .. te llevan a raíz, los siguientes .. avanzan dos niveles.
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}



module.exports = app;