const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoria, existeCategoriaPorNombre } = require('../helpers/db-validators');

const router = Router();


//Obtener todas las categorias
router.get('/', obtenerCategorias );

//Obtener categoria por id - publico
router.get('/:id', 
    [
        check('id').custom(existeCategoria),
        validarCampos
    ] ,
    obtenerCategoria
);

//Crear categoria - privado - cualaquier persona
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ] , 
    crearCategoria   
);

//Actualizar categoria - privado- cualquier con token válido
router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoria),
        check('nombre').custom(existeCategoriaPorNombre),
        validarCampos

    ],
    actualizarCategoria 
);

//Borrar una categoria - Admin
router.delete('/:id', 
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    borrarCategoria
);



module.exports = router