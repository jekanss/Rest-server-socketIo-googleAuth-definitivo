const { response, request } = require("express");
const { Categoria } = require('../models')

//Obtener Categorias - paginado - total - populate

const obtenerCategorias = async (req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    

    //Ejecuta ambas al tiempo y no da respuesta hasta que ambas se cumplan
    const [ total, usuarios ] = await Promise.all([
        //total
        Categoria.countDocuments( query ),
        //Categorias
        Categoria.find( query )
                    .populate('usuario', 'nombre')
                    .skip(Number(desde))
                    .limit(Number(limite))
    ]);
    
    res.status(200).json({ 
        total,
        usuarios
    });

}



//Obtener Categoria -  populate

const obtenerCategoria = async ( req, res = response) => {

    const id = req.params['id']

    const categoria = await Categoria.findById ( id )
                                            .populate('usuario', 'nombre')

    res.status(201).json( {
        categoria
    })
    
}

//Crear Categoria
 const crearCategoria = async ( req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria  = new Categoria ( data );

    //Guardar DB

    await categoria.save()

    res.status(201).json({
        categoria
    })

 }

 //Actualizar Categoria

 const actualizarCategoria = async ( req, res = response ) => {

    id = req.params['id']   
    const  nombre  = req.body.nombre.toUpperCase()    
    
    const categoriaActualizada = await Categoria.findByIdAndUpdate ( id , { nombre }, { new: true } )

    res.status(201).json({
        categoriaActualizada
    })


 }


 //BorrarCategoria - estado: false

 const borrarCategoria = async ( req, res = response ) => {

    id = req.params['id']         
    
    const categoriaEliminada = await Categoria.findByIdAndUpdate ( id , { estado: false }, { new: true } )

    res.status(201).json({
        categoriaEliminada
    })
 } 


 module.exports =  {
     crearCategoria,
     obtenerCategorias,
     obtenerCategoria,
     actualizarCategoria,
     borrarCategoria  
 }