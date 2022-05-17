const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');
const { existeProductoporId, existeCategoria } = require('../helpers/db-validators');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/producto.controller');

const router = Router();

//Crear producto - privado - cualaquier persona
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'No es un id de Mongo').isMongoId(),
        check('categoria').custom(existeCategoria),
        validarCampos
    ] , 
    crearProducto   
);

//Obtener todas los productos
router.get('/', obtenerProductos );

//Obtener producto por id - publico
router.get('/:id', 
    [
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom(existeProductoporId),
        validarCampos
    ] ,
    obtenerProducto
);

//Actualizar Producto
router.put('/:id',
    [
        validarJWT,   
        check('id', 'No es un id de Mongo válido').isMongoId(),     
        check('id').custom(existeProductoporId),        
        validarCampos
    ],
    actualizarProducto 
);

//Borrar un producto - Admin
router.delete('/:id', 
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id de Mongo válido').isMongoId(), 
        check('id').custom( existeProductoporId ),
        validarCampos
    ],
    borrarProducto
);




module.exports = router