
const express    = require('express');
const http     = require('http');
const cors       = require('cors');
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const socketio   = require('socket.io');
const path       = require('path');

//Sockets
const Sockets  = require('./sockets');


const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT

        //Http Server
        this.server = http.createServer(this.app);

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }
      
        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();        
    }

    async conectarDB(){

        await dbConnection();

    }

    middlewares(){

        //cors
        this.app.use( cors() );

        // Parseo y lectura de body's
        this.app.use( express.json() );

        //Servir la carpeta publica
        this.app.use( express.static('public') );

        //Poder leer x-www-form-urlencoded y raw JSON
        this.app.use(bodyParser.json()); // support json encoded bodies
        this.app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

         //Configuraciones de sockets
         this.io = socketio(this.server, { /** Configuraciones */});

         //Deslpegar el direcotrio publico
         this.app.use(express.static( path.resolve( __dirname, '../public') ));

    }

    routes(){

        this.app.use( this.paths.auth ,      require('../routes/auth.routes'));
        this.app.use( this.paths.buscar ,    require('../routes/buscar.routes'));
        this.app.use( this.paths.usuarios,   require('../routes/usuarios.routes'));
        this.app.use( this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use( this.paths.productos,  require('../routes/producto.routes'));
        this.app.use( this.paths.uploads,    require('../routes/uploads.routes'));
        
    }

    listen(){
        this.app.listen( this.port , () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports =  Server;