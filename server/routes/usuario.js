const express = require('express');
//const bcrypt = require('bcrypt');  //no funcionó la instalación
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();




//GET
app.get('/usuario', verificaToken, (req, res) => { //verificaToken es un middleware que verifica si es correcta la solicitud y si es así procede

    let desde = req.query.desde || 0; //le pregunto al usuario desde qué página desea ver si no especifica será desde el 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //en los {} especificamos el filtro de la consulta y con la cadena de caracteres 'nombre email etc' los atributos que deseamos ver
        .skip(desde) //se salta los siguientes 5
        .limit(limite) //indicamos cuantos registros deseo ver en la búsqueda
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        })



});







//POST
/* app.post('/usuario', function(req, res) { //el post se utiliza para insertar nuevos registros
    let body = req.body;

    //obtenemos los datos a guardar
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });


    //guardamos los datos en la BD
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.jason({
            ok: true,
            usuario: usuarioDB
        });

    });

}); */

//POST
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        //password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save()
        .then((usuarioDB) => {
            console.log("Guardado correctamente", usuarioDB);
            //usuarioDB.password = null; //para que no aparezca la información al usuario del password
            res.json({
                ok: true,
                usuario: usuarioDB
            })

        })
        .catch((err) => console.log(err))

});






//PUT
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) { //el put se utiliza para actualizar registros
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //_.pick() es una función del paquete underscore que permite seleccionar que elementos del objeto deseo que el usuario pueda editar
    //let body = req.body;

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })



});






//DELETE
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) { //el delete se utiliza para eliminar registros
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };



    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //findByIdAndRemove borra de manera física el registro de la BD
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };


        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };



        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});






module.exports = app;