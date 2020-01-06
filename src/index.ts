
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

import App from './app';
import SocketServer from './shared/lib/socket.io/socket';

import Config from './shared/lib/config';

// handle uncaught errors
process.on('unhandledRejection', (reason, p) => {
    // I just caught an unhandled promise rejection, since we already have fallback handler for unhandled errors (see below), throw and let him handle that
    throw reason;
});
process.on('uncaughtException', err => {
    // I just received an error that was never handled
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
});

const port = normalizePort( Config.get('HTTP-WS').PORT || 8080 );
App.set('port', port);

let httpServer;
if ( Config.get('HTTP-WS').SSL.IS_ENABLED ) {  // encryption
    const sslOptions = {
        key: fs.readFileSync(__dirname + '/../config/' + Config.get('HTTP-WS').SSL.KEY_PATH),
        cert: fs.readFileSync(__dirname + '/../config/' + Config.get('HTTP-WS').SSL.CERT_PATH),
        passphrase: Config.get('HTTP-WS').SSL.PWD
    };
    httpServer = https.createServer(sslOptions, App);
}
else            // no encryption
    httpServer = http.createServer(App);

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

SocketServer.setup(httpServer);

function normalizePort(val: number|string): number|string|boolean {
    const myPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(myPort)) return val;
    else if (myPort >= 0) return myPort;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = httpServer.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`Server is listening on ${bind}`);
}

