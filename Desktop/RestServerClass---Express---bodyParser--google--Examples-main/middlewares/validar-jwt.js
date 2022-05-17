
const { response, request } = require('express')
const Usuario = require('../models/usuario.model')
const jwt = require('jsonwebtoken')

const validarJWT = async ( req = request , res = response, next) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json( {
            msg: 'No hay token en la petición'
        });
    }

    try {

        //verificar token contra nuestra llave secreta
        const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);

        //Verificar si existe el usuario a autenticar
        const usuario = await Usuario.findById( uid );

        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            })
        }        

        //Verficar si el uid tiene estado en true osea activo
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false'
            })
        }

        req.usuario = usuario;
        
        //enviar el uid en el req
        // req.uid = uid;        
        
        next()
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
        
    }   
    

}

module.exports = {
    validarJWT
}