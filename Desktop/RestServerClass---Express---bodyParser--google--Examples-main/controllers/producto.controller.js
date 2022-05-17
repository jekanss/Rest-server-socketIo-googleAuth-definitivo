const { response, request } = require("express");
const { Producto } = require('../models')

//Crear Categoria
const crearProducto = async ( req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        })
    }
    try {
        // Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }
    
        const producto  = new Producto ( data );
    
        //Guardar DB
    
        await producto.save()
        
        res.status(201).json({
            producto
        })
    } catch (error) {
      console.log(error);
      res.status(500).json({
          ok: false,
          msg: 'Error ineseperado, hable con el administrador'
      })
        
    }
 



 }


 const obtenerProductos = async ( req, res = response) => { 
     

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }
    

    //Ejecuta ambas al tiempo y no da respuesta hasta que ambas se cumplan
    const [ total, productos ] = await Promise.all([
        //total
        Producto.countDocuments( query ),
        //Productos
        Producto.find( query )
                    .populate('usuario', 'nombre')
                    .populate('categoria', 'nombre')
                    .skip(Number(desde))
                    .limit(Number(limite))
    ]);
    
    res.status(200).json({ 
        total,
        productos
    });

 }

 const obtenerProducto = async ( req, res = response ) => {

    const id = req.params['id']

    const producto = await Producto.findById ( id )
                                            .populate('usuario', 'nombre')
                                            .populate('categoria', 'nombre')

    res.status(201).json( {
        producto
    })

 }

 const actualizarProducto = async ( req, res = response ) => {

    id = req.params['id']   
    const { estado, usuario, ...data }  = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    
    const productoActualizado = await Producto.findByIdAndUpdate ( id , data, { new: true } )

    res.status(201).json({
        productoActualizado
    })

}

const borrarProducto = async ( req, res = response ) => {

    id = req.params['id']         
    
    const productoEliminado = await Producto.findByIdAndUpdate ( id , { estado: false }, { new: true } )

    res.status(201).json({
        productoEliminado
    })

}
 

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}