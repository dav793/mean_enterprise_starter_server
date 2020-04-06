import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

import {IReqMetadata} from '../../request-metadata-factory';
import {LogOperation, LogResourceName} from '../../../../modules/log/log-enums';
import {logControllerSingleton as LogController} from '../../../../modules/log/log-controller';
import SocketIOServer from '../../../lib/socket.io/socket';

import {IDeleteOneParams, deleteOne} from '../delete-one';
import {SocketMessagePayloadType, SocketMessageType} from '../../../lib/socket.io/socket-types';

describe('Operators => deleteOne', () => {

    it('should delete an object, when no logging or socket parameters are provided', (done) => {

        const meta: IReqMetadata = { clientId: '123' };

        const originalObj = {
            _id: '1',
            deleted: false
        };

        const fnCalls = {
            deleteSingleAction: 0,
            fetchSingleAction: 0
        };

        const fnStubs = {
            deleteSingleAction:     of(Object.assign({}, originalObj, { deleted: true } ))
                .pipe( tap(() => fnCalls.deleteSingleAction++) ),

            fetchSingleAction:      of(originalObj)
                .pipe( tap(() => fnCalls.fetchSingleAction++) )
        };

        const params: IDeleteOneParams = {
            deleteSingleAction: () => fnStubs.deleteSingleAction,
            fetchSingleAction: () => fnStubs.fetchSingleAction
        };

        deleteOne(params, meta).subscribe(
            (result) => {
                expect(fnCalls.fetchSingleAction).toEqual(1);
                expect(fnCalls.deleteSingleAction).toEqual(1);
                expect(result).toEqual(true);
                done();
            },
            err => {
                fail(err);
                done();
            }
        );

    });

    it('should delete an object, log operation and broadcast socket message', (done) => {

        const meta = { clientId: '123' };
        const originalObj = {
            _id : '000000000000000000000000',
            deleted: false
        };
        (originalObj as any).toObject = () => originalObj;

        const fnCalls = {
            deleteSingleAction: 0,
            fetchSingleAction: 0
        };

        const fnStubs = {
            deleteSingleAction:     of(Object.assign({}, originalObj, { deleted: true } ))
                .pipe( tap(() => fnCalls.deleteSingleAction++) ),

            fetchSingleAction:      of(originalObj)
                .pipe( tap(() => fnCalls.fetchSingleAction++) )
        };

        const params: IDeleteOneParams = {
            deleteSingleAction: () => fnStubs.deleteSingleAction,
            fetchSingleAction: () => fnStubs.fetchSingleAction,
            logging: {
                resourceName: LogResourceName.USER,
                operation: LogOperation.DELETE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_USERS
            }
        };

        deleteOne(params, meta).subscribe(
            (result: any) => {

                expect(fnCalls.fetchSingleAction).toEqual(1);
                expect(fnCalls.deleteSingleAction).toEqual(1);

                expect(depCalls.logOperation.calls).toEqual(1);
                expect(depCalls.logOperation.args[0]).toEqual(LogResourceName.USER);
                expect(depCalls.logOperation.args[1]).toEqual(LogOperation.DELETE);
                expect(depCalls.logOperation.args[2]).toEqual(originalObj);
                expect(depCalls.logOperation.args[3]).toEqual(originalObj);
                expect(depCalls.logOperation.args[4]).toEqual({ clientId: meta.clientId});

                expect(depCalls.broadcast.calls).toEqual(1);
                expect(depCalls.broadcast.args[0]).toEqual(SocketMessageType.UPDATE_USERS);
                expect(depCalls.broadcast.args[1]).toEqual({ originatorId: meta.clientId });

                expect(result).toEqual(true);
                done();

            },
            err => {
                fail(err);
                done();
            }
        );

    });

    beforeEach(() => mockDependencies());
    afterEach(() => restoreDependencies());

});

const depReferences = {
    logOperation: null,
    broadcast: null
};

const depCalls = {
    logOperation: {
        calls: 0,
        args: null
    },
    broadcast: {
        calls: 0,
        args: null
    }
};

function logOperationMock(resource: LogResourceName, operation: LogOperation, original: any, modified: any, meta: IReqMetadata = {}): Observable<void> {
    depCalls.logOperation.calls++;
    depCalls.logOperation.args = arguments;
    return of(null);
}

function broadcastMock(type: SocketMessageType, data?: SocketMessagePayloadType): void {
    depCalls.broadcast.calls++;
    depCalls.broadcast.args = arguments;
}

const mockDependencies = () => {
    depReferences.logOperation = LogController.logOperation;
    depReferences.broadcast = SocketIOServer.broadcast;
    LogController.logOperation = logOperationMock;
    SocketIOServer.broadcast = broadcastMock;
};

const restoreDependencies = () => {
    LogController.logOperation = depReferences.logOperation;
    SocketIOServer.broadcast = depReferences.broadcast;
    depCalls.logOperation.calls = 0;
    depCalls.logOperation.args = null;
    depCalls.broadcast.calls = 0;
    depCalls.broadcast.args = null;
};
