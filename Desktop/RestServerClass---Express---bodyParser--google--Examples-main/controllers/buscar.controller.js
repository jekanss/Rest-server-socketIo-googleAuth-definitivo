const { response } = require("express");
const { ObjectId } = require('mongoose').Types
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async ( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True o false
    
    //SI EL TERMINO ES UN ID DE MONGO
    if( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    //Busca  por nombre o correo

    const regex = new RegExp( termino, 'i')

    //busca si coincide el correo o el nombre
    const cantidad = await Usuario.count( { 
        $or: [ { nombre: regex }, { correo: regex }],
        $and: [ { estado: true }]
     });

    const usuarios = await Usuario.find( { 
        $or: [ { nombre: regex }, { correo: regex }],
        $and: [ { estado: true }]
     });

    res.json({
        cantidad,
        results: usuarios
    });

}

const buscarCategorias = async ( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True o false
    
    //SI EL TERMINO ES UN ID DE MONGO
    if( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    //Busca  por nombre o correo

    const regex = new RegExp( termino, 'i')

    //busca si coincide el correo o el nombre
    const cantidad = await Categoria.count( { nombre: regex, estado: true });

    const categorias = await Categoria.find( { nombre: regex, estado: true } );

    res.json({    
        cantidad,    
        results: categorias
    });

}

const buscarProductos = async ( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // True o false
    
    //SI EL TERMINO ES UN ID DE MONGO
    if( esMongoID ) {
        const producto = await Producto.findById(termino)
                                            .populate('categoria', 'nombre');;
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    //Busca  por nombre o correo

    const regex = new RegExp( termino, 'i')

    //cantidad de registros con esa coincidencia
    const cantidad = await Producto.count( { nombre: regex, estado: true });

    //busca productos
    const productos = await Producto.find( { nombre: regex, estado: true } )
                                                .populate('categoria', 'nombre');

    res.json({    
        cantidad,    
        results: productos
    });

}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params

    if( !coleccionesPermitidas.includes (coleccion) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son : ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg:'Se me olvió hacer está búsqueda'
            })
    }

   
}

module.exports = {
    
    buscar

}