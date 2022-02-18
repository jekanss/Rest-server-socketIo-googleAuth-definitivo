
const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {

    const {q, nombre = "No Name", apikey} = req.query
    
    res.status(200).json({          
        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = (req = request, res = response) => {
    
    const data = req.body

    res.status(200).json({          
        msg: 'Post API - controlador',
        data
    });
}

const usuariosPut = (req = request, res = response) => {

    const id = req.params['id']
    
    res.status(200).json({          
        msg: 'Put API - controlador',
        id
    });
}

const usuariosPatch = (req = request, res = response) => {
    
    res.status(200).json({          
        msg: 'Patch API - controlador'
    });
}

const usuariosDelete = (req = request, res = response) => {
    
    res.status(200).json({          
        msg: 'Delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}