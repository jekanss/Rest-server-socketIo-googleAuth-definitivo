const Server  = require('./models/server');

require('dotenv').config();

console.clear()

//Creando instancia del servidor
const server = new Server();

//llamar metodo para levantar el servidor
server.listen();


