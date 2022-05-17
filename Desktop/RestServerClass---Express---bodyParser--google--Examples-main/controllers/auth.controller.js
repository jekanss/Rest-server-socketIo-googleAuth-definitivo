const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario.model')

const login = async ( req, res = response ) => {
    
    const { correo, password } = req.body;

    try {
        
        //Verificar si el eamil existe
        const usuario = await Usuario.findOne({correo});
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Si el usuario está activo
        if( usuario.estado == false ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar JSON Web token
        const token = await generarJWT ( usuario.id );


        res.json({
            usuario,
            token    
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:'Algo salió mal, hable con el administrador'
        });
    }

};

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        //Verificar token de login Google y traaer la información deseada
        //Desde la función googleVerify que está en el helper
        const { correo, nombre, img } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne( { correo });

        if ( !usuario ){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB está borrado o su estado en false
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar JSON Web token
        const token = await generarJWT ( usuario.id );
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })        
    }


}

module.exports = {
    login,
    googleSignIn
}