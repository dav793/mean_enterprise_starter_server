import {
    ISocketMessage,
    SocketMessageType,
    IAssignClientIdPayload,
    SocketMessagePayloadType, IRequestAuthenticationPayload
} from './socket-types';

export class SocketIOServer {

    io: any;
    ready = false;

    constructor() {}

    setup(httpServer) {
        this.io = require('socket.io')(httpServer);

        this.io.on('connection', (function(socket) {

            console.log(`SOCKET: client ${socket.id} connected`);
            this.sendClientId(socket);

            socket.on('disconnect', function() {
                console.log(`SOCKET: client ${socket.id} disconnected`);
            });

            socket.on('clientEvent', function(msg) {
                console.log(`SOCKET: client ${socket.id} sent message ${JSON.stringify(msg)}`);
            });

        }).bind(this));

        this.ready = true;
    }

    broadcast(type: SocketMessageType, data?: SocketMessagePayloadType): void {
        if (!this.ready)
            return;

        const messageObject = this.createMessageObject(type, data ? data : {});
        this.io.emit('serverEvent', messageObject);
    }

    sendAuthenticationRequest(clientId: string, originatorId: string) {
        if (!this.io.sockets.connected || !this.io.sockets.connected[clientId])
            return;

        const socket = this.io.sockets.connected[clientId];
        const data: IRequestAuthenticationPayload = { clientId, originatorId };
        const requestAuthenticationMessage = this.createMessageObject(SocketMessageType.REQUEST_AUTHENTICATION, data);
        socket.emit('serverEvent', requestAuthenticationMessage);
    }

    protected sendClientId(socket) {
        const data: IAssignClientIdPayload = { clientId: socket.id };
        const assignClientIdMessage = this.createMessageObject(SocketMessageType.ASSIGN_CLIENT_ID, data);
        socket.emit('serverEvent', assignClientIdMessage);
    }

    protected createMessageObject(type: SocketMessageType, data: SocketMessagePayloadType): ISocketMessage {
        return {
            type,
            data
        };
    }

}

export default new SocketIOServer();
