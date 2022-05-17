
const { Router } = require('express');
const { check } = require('express-validator');

//middlewares
const { validarCampos,
        validarJWT,
        tieneRole } = require('../middlewares/index')

const { usuariosGet, 
        usuariosPut, 
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios.controller'); 
               
const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet);

router.post('/',[
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),  
   check('password', 'El password es obligatorio y debe ser más de 6 letras').isLength({ min: 6 }),
   check('correo').custom ( (correo) => existeEmail(correo) ),
   check('rol').custom ( (rol) => esRolValido(rol) ),
   validarCampos
], usuariosPost );

router.put('/:id',[
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom( (id) => existeUsuarioPorId(id) ),
    check('rol').custom ( (rol) => esRolValido(rol) ),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    //Tiene role tiene que ser alguno de los roles especificados
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom( (id) => existeUsuarioPorId(id) ),
    validarCampos
] , usuariosDelete );

 module.exports = router