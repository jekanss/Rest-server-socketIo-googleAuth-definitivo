
const { request, response } = require('express');
const Usuario = require('../models/usuario.model')
const bcryptjs = require('bcryptjs');

//Traer usuarios
const usuariosGet = async (req = request, res = response) => {  
    
    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true }
    

    //Ejecuta ambas al tiempo y no da respuesta hasta que ambas se cumplan
    const [ total, usuarios ] = await Promise.all([
        //total
        Usuario.countDocuments( query ),
        //usuarios
        Usuario.find( query)
                    .skip(Number(desde))
                    .limit(Number(limite))
    ]);
    
    res.status(200).json({ 
        total,
        usuarios
    });
}

//Crear usuario
const usuariosPost = async (req = request, res = response) => {
    
    //Si quiero extraer los demas datos excepto el nombre
    // const { nombre, ...demasDatos } = req.body  

    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario( { nombre, correo, password, rol } );   


    //encryptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt);

    //Guardas en base de datos

    await usuario.save();

    res.status(200).json({          
        msg: 'Post API - controlador',
        usuario: usuario
    });
}

const usuariosPut = async (req = request, res = response) => {

    const id = req.params['id']
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if( password ){
       //encryptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id , resto );
    
    res.status(200).json({         
        usuario
    });
}

const usuariosPatch = (req = request, res = response) => {
    
    res.status(200).json({          
        msg: 'Patch API - controlador'
    });
}

const usuariosDelete = async (req = request, res = response) => {

    const id = req.params['id'];

    //recuperar el uid creado en el middleware validarJWT
    // const uid  = req.uid;

    //Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false}, { new: true } );
    const usuarioAutenticado = req.usuario

    
    res.status(200).json({          
        usuario,
        usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}