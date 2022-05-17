const { response, request } = require("express")

const esAdminRole = ( req = request, res = response, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg:'Se quiere verficar el role sin validar el token primero'
        })
    }

    const { rol , nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No está autorizado`
        })
    }

    next()

}

const tieneRole = ( ...roles ) => {

    return (req = request, res = response, next) =>  {
        
        if( !req.usuario ){
            return res.status(500).json({
                msg:'Se quiere verficar el role sin validar el token primero'
            })
        }

        //si los roles no incluyen al rol del usuario
        if( !roles.includes( req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        next()
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}