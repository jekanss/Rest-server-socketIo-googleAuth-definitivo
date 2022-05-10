import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:5000' , options: { transports : ['websocket'] }  };

export const environment = {
  production: false,
  socketConfig: config
};