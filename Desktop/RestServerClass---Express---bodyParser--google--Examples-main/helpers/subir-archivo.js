const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

       //Obtener el archivo
       const { archivo } = files;     
   
       //verificar extensión del archivo
       const nombreCortado = archivo.name.split('.');
       const extension = nombreCortado [ nombreCortado.length - 1 ];        
   
       // Si la extensión del archivo subido no incluyen las extensionesValidas...
       if ( !extensionesValidas.includes ( extension )){
           return reject(`La extensión ${extension} no es permitida, extensiones válidas: ${extensionesValidas}`)
       }   
   
       //generando nombre unico para el achivo
       const nombreTemp = uuidv4() + '.' + extension;
       
       // Path de dónde se va guardar el archivo
       const uploadPath = path.join( __dirname,'../uploads/', carpeta, nombreTemp );
       
       // Sube el archivo al server
       archivo.mv(uploadPath, (err) => {
         if (err) {
           reject(err);
         }
     
         resolve( nombreTemp );
   
       });

    }) 

}

module.exports = {
    subirArchivo
}