const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');


//===========================
// Obtener productos
//===========================
app.get('/productos', verificaToken, (req, res) => {
    //establecemos la paginación de los productos a mostrarse
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde) //desde que producto se desea ver
        .limit(5) //permite ver cuantos productos por página
        .populate('usuario', 'nombre email') //especificamos que de la colección usuario deseo los campos nombre e email
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos
            });

        })
});





//===========================
// Obtener un producto específico
//===========================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }


            res.json({
                ok: true,
                producto: productoDB
            });


        });




});





//===========================
// Buscar productos
//===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i') //es el equivalente al like. Busca caracteres que concuerdan con la cadena. No tiene que ser exactamente igual. La letra 'i' indica que no importa que sean mayúsculas o minúsculas

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            res.json({
                ok: true,
                productos
            })
        })
});





//===========================
// Crear un nuevo producto
//===========================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }


        res.status(201).json({
            ok: true,
            producto: productoDB
        });





    });


});





//===========================
// Actualizar un nuevo producto
//===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }


        //Si no hay error, actualizamos el objeto
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                producto: productoGuardado
            });
        });


    });
});





//===========================
// Actualizar un nuevo producto
//===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }


        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        });


    });
});








module.exports = app;