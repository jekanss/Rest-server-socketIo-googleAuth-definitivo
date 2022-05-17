const { response } = require("express")

 
 const validaArchivoSubir = ( req, res = response, next) => {
    
  // Si no existe archivo retorna esto
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
    res.status(400).json({
         msg: 'No hay archivos para subir - validarArchivoSubir '
    });
    return;
  }

  next()

 }

 module.exports = {
     validaArchivoSubir
 }