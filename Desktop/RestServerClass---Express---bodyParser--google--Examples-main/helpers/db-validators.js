const Role = require('../models/rol.model');

const { Producto, Usuario, Categoria  } = require('../models');

const esRolValido = async ( rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ){
       throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}


const existeEmail = async ( correo = '') => {
    const existeEmail = await Usuario.findOne({ correo: correo});
    if( existeEmail ){    
        throw new Error('El correo ya está registrado')
    }      
}

const existeUsuarioPorId = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){    
        throw new Error(`El id ${id} no existe`)
    }      
}

const existeCategoria = async ( id ) => {
    const existeCategoria = await Categoria.findOne( { _id: id , estado: true });
    if( !existeCategoria ){    
        throw new Error(`La categoria ${id} no existe`)
    }      
}

const existeCategoriaPorNombre = async ( nombre ) => {
    nombre = nombre.toUpperCase()
    const existeCategoriaPorNombre = await Categoria.findOne(  { nombre, estado: true } );
    if( existeCategoriaPorNombre ){    
        throw new Error(`Ya existe una categoria por ese nombre`)
    }      
}

/**
 * Productos ---------------------------------------------------------------
*/

const existeProductoporId = async ( id ) => {
   
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){    
        throw new Error(`El Id de producto no existe`)
    }      
}

/**
 * Validar colecciones permitidas -------------------------------------------------
 */

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const  incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`la colección ${coleccion} no es permitida, colecciones permitidas: ${ colecciones }`);
    }

    return true;

}

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoria,
    existeCategoriaPorNombre,
    existeProductoporId,
    coleccionesPermitidas
}