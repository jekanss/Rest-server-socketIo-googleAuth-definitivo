const { Router } = require('express');
const { check } = require('express-validator');

const { validaArchivoSubir, validarCampos } = require('../middlewares');

const { coleccionesPermitidas } = require('../helpers');

const { cargarArchivo, 
        actualizarImagen, 
        mostrarImagen} = require('../controllers/uploads.controller');

const router = Router();

router.post('/', validaArchivoSubir , cargarArchivo);

router.put('/:coleccion/:id', [
    validaArchivoSubir,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c , ['usuarios', 'productos'] )),
    validarCampos
] , actualizarImagen )

router.get('/:coleccion/:id', [    
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c , ['usuarios', 'productos'] )),
    validarCampos
], mostrarImagen )


module.exports = router