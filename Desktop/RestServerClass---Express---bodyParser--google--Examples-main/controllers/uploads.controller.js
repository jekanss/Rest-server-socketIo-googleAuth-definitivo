const path = require('path');
const  fs = require('fs');


const { response } = require("express");
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');


const cargarArchivo = async ( req, res = response ) => {  
   

    try {

      //Subir imagenes ya que asi está por defecto en el helper
      const nombre = await subirArchivo(req.files, undefined, 'img');
      
      //Subir txt o markdowns
      //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos' );

      res.json({
        nombre
      });

    } catch (error) {
      console.log(error)
      res.status(400).json({
        error
      })
      
    }

    

}

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;  


  let modelo;

  switch ( coleccion ) {
    case 'usuarios':      
        modelo = await Usuario.findById(id);
        if(!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`
          });
        }

      break;
  
    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      
      break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' });
  }

  // Limpiar imagen previa del registro si existe
  if ( modelo.img ){
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )
    if( fs.existsSync (pathImagen) ) {
      fs.unlinkSync( pathImagen );
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion );
  modelo.img = nombre;

  await modelo.save();

  res.json( modelo )
  

}

const mostrarImagen = async ( req, res = response ) => {

  const { id, coleccion } = req.params;  


  let modelo;

  switch ( coleccion ) {
    case 'usuarios':      
        modelo = await Usuario.findById(id);
        if(!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`
          });
        }

      break;
  
    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      
      break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' });
  }

  // Si el registro tiene imagen
  if ( modelo.img ){
    //Enviar la imagen desde el server para consumirlo en el front
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )
    if( fs.existsSync (pathImagen) ) {
      return res.sendFile( pathImagen )
    }
  } 
  
  // Si el registro no tiene imagen
  const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
  res.sendFile( pathImagen );


}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}