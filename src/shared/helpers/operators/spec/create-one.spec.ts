import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

import {IReqMetadata} from '../../request-metadata-factory';
import {ErrorName} from '../../../enums/errors';
import {LogOperation, LogResourceName} from '../../../../modules/log/log-enums';
import {logControllerSingleton as LogController} from '../../../../modules/log/log-controller';
import {globalVariableControllerSingleton as GlobalVariableController} from '../../../../modules/global-variable/global-variable-controller';
import EntityIdentifierGenerator from '../../entity-identifier-generator';
import SocketIOServer from '../../../lib/socket.io/socket';
import {SocketMessagePayloadType, SocketMessageType} from '../../../lib/socket.io/socket-types';

import {ICreateOneParams, createOne} from '../create-one';

describe('Operators => createOne', () => {

    it('should create an object, when no logging or socket parameters are provided', (done) => {

        const meta: IReqMetadata = { clientId: '123' };

        const newObj = {
            _id: '1',
            name: 'A'
        };

        const fnCalls = {
            createSingleAction: 0
        };

        const fnStubs = {
            createSingleAction:     of(Object.assign({}, newObj ))
                .pipe( tap(() => fnCalls.createSingleAction++) ),
        };

        const params: ICreateOneParams = {
            createSingleAction: () => fnStubs.createSingleAction
        };

        createOne(params, meta).subscribe(
            (createdObj) => {
                expect(fnCalls.createSingleAction).toEqual(1);
                expect(createdObj).toEqual(newObj);
                done();
            },
            err => {
                fail(err);
                done();
            }
        );

    });

    it('should create an object, log operation and broadcast socket message', (done) => {

        const meta = { clientId: '123' };
        const newObj = {
            _id : '000000000000000000000000',
            name: 'A'
        };
        (newObj as any).toObject = () => newObj;

        const fnCalls = {
            createSingleAction: 0
        };

        const fnStubs = {
            createSingleAction:     of(Object.assign({}, newObj ))
                .pipe( tap(() => fnCalls.createSingleAction++) )
        };

        const params: ICreateOneParams = {
            createSingleAction: () => fnStubs.createSingleAction,
            logging: {
                resourceName: LogResourceName.USER,
                operation: LogOperation.CREATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_USERS
            }
        };

        createOne(params, meta).subscribe(
            (createdObj: any) => {

                expect(fnCalls.createSingleAction).toEqual(1);

                expect(depCalls.logOperation.calls).toEqual(1);
                expect(depCalls.logOperation.args[0]).toEqual(LogResourceName.USER);
                expect(depCalls.logOperation.args[1]).toEqual(LogOperation.CREATE);
                expect(depCalls.logOperation.args[2]).toEqual({});
                expect(depCalls.logOperation.args[3]).toEqual(newObj);
                expect(depCalls.logOperation.args[4]).toEqual({ clientId: meta.clientId});

                expect(depCalls.broadcast.calls).toEqual(1);
                expect(depCalls.broadcast.args[0]).toEqual(SocketMessageType.UPDATE_USERS);
                expect(depCalls.broadcast.args[1]).toEqual({ originatorId: meta.clientId });

                expect(createdObj).toEqual(newObj);
                done();

            },
            err => {
                fail(err);
                done();
            }
        );

    });

    it('should create an object, and auto-fill official ID when none is given', (done) => {

        const meta = { clientId: '123' };

        const newObj = {
            _id : '000000000000000000000000'
        };
        (newObj as any).toObject = () => newObj;

        const existingObjs = [
            {
                _id : '000000000000000000000001',
                officialId: '1',
            },
            {
                _id : '000000000000000000000002',
                officialId: '2'
            }
        ];

        const fnCalls = {
            createSingleAction: 0,
            generateIdAction: 0,
            fetchLastIdAction: 0,
            fetchAllAction: 0
        };

        const fnStubs = {
            createSingleAction:     (officialId: string) => of(Object.assign({}, newObj, { officialId } ))
                                        .pipe( tap(() => fnCalls.createSingleAction++) ),

            generateIdAction:       (lastId: string|null = null): string => {
                fnCalls.generateIdAction++;
                return '3';
            },

            fetchLastIdAction:      of('2')
                                        .pipe( tap(() => fnCalls.fetchLastIdAction++) ),

            fetchAllAction:         of(existingObjs)
                                        .pipe( tap(() => fnCalls.fetchAllAction++) )
        };


        const fetchLastIdTempRef = GlobalVariableController.getLastCaseIdentifier;
        GlobalVariableController.getLastCaseIdentifier = () => fnStubs.fetchLastIdAction;

        const generateNextCaseIdentifierTempRef = EntityIdentifierGenerator.generateNextCaseIdentifier;
        EntityIdentifierGenerator.generateNextCaseIdentifier = fnStubs.generateIdAction;

        const restoreDeps = () => {
            GlobalVariableController.getLastCaseIdentifier = fetchLastIdTempRef;
            EntityIdentifierGenerator.generateNextCaseIdentifier = generateNextCaseIdentifierTempRef;
        };

        const params: ICreateOneParams = {
            createSingleAction: (officialId) => fnStubs.createSingleAction(officialId),
            logging: {
                resourceName: LogResourceName.USER,
                operation: LogOperation.CREATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_USERS
            },
            officialIdGeneration: {
                officialId: null,
                fetchAllAction: () => fnStubs.fetchAllAction,
                globalVariableController: GlobalVariableController,
                entityIdentifierGenerator: EntityIdentifierGenerator
            }
        };

        createOne(params, meta).subscribe(
            (createdObj: any) => {

                expect(fnCalls.createSingleAction).toEqual(1);

                expect(fnCalls.fetchLastIdAction).toEqual(1);
                expect(fnCalls.generateIdAction).toEqual(1);

                expect(depCalls.logOperation.calls).toEqual(1);
                expect(depCalls.logOperation.args[0]).toEqual(LogResourceName.USER);
                expect(depCalls.logOperation.args[1]).toEqual(LogOperation.CREATE);
                expect(depCalls.logOperation.args[2]).toEqual({});
                expect(depCalls.logOperation.args[3]).toEqual(newObj);
                expect(depCalls.logOperation.args[4]).toEqual({ clientId: meta.clientId});

                expect(depCalls.broadcast.calls).toEqual(1);
                expect(depCalls.broadcast.args[0]).toEqual(SocketMessageType.UPDATE_USERS);
                expect(depCalls.broadcast.args[1]).toEqual({ originatorId: meta.clientId });

                expect(createdObj).toEqual(Object.assign({}, newObj, { officialId: '3' }));

                restoreDeps();
                done();

            },
            err => {
                fail(err);
                restoreDeps();
                done();
            }
        );

    });

    it('should create an object, and use given official ID', (done) => {

        const meta = { clientId: '123' };

        const newObj = {
            _id : '000000000000000000000000'
        };
        (newObj as any).toObject = () => newObj;

        const existingObjs = [
            {
                _id : '000000000000000000000001',
                officialId: '1',
            },
            {
                _id : '000000000000000000000002',
                officialId: '2'
            }
        ];

        const fnCalls = {
            createSingleAction: 0,
            generateIdAction: 0,
            fetchLastIdAction: 0,
            fetchAllAction: 0
        };

        const fnStubs = {
            createSingleAction:     (officialId: string) => of(Object.assign({}, newObj, { officialId } ))
                .pipe( tap(() => fnCalls.createSingleAction++) ),

            generateIdAction:       (lastId: string|null = null): string => {
                fnCalls.generateIdAction++;
                return '3';
            },

            fetchLastIdAction:      of('2')
                .pipe( tap(() => fnCalls.fetchLastIdAction++) ),

            fetchAllAction:         of(existingObjs)
                .pipe( tap(() => fnCalls.fetchAllAction++) )
        };

        const fetchLastIdTempRef = GlobalVariableController.getLastCaseIdentifier;
        GlobalVariableController.getLastCaseIdentifier = () => fnStubs.fetchLastIdAction;

        const generateNextAccountIdentifierTempRef = EntityIdentifierGenerator.generateNextCaseIdentifier;
        EntityIdentifierGenerator.generateNextCaseIdentifier = fnStubs.generateIdAction;

        const restoreDeps = () => {
            GlobalVariableController.getLastCaseIdentifier = fetchLastIdTempRef;
            EntityIdentifierGenerator.generateNextCaseIdentifier = generateNextAccountIdentifierTempRef;
        };

        const params: ICreateOneParams = {
            createSingleAction: (officialId) => fnStubs.createSingleAction(officialId),
            logging: {
                resourceName: LogResourceName.USER,
                operation: LogOperation.CREATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_USERS
            },
            officialIdGeneration: {
                officialId: '4',
                fetchAllAction: () => fnStubs.fetchAllAction,
                globalVariableController: GlobalVariableController,
                entityIdentifierGenerator: EntityIdentifierGenerator
            }
        };

        createOne(params, meta).subscribe(
            (createdObj: any) => {

                expect(fnCalls.createSingleAction).toEqual(1);

                expect(fnCalls.fetchAllAction).toEqual(1);

                expect(depCalls.logOperation.calls).toEqual(1);
                expect(depCalls.logOperation.args[0]).toEqual(LogResourceName.USER);
                expect(depCalls.logOperation.args[1]).toEqual(LogOperation.CREATE);
                expect(depCalls.logOperation.args[2]).toEqual({});
                expect(depCalls.logOperation.args[3]).toEqual(newObj);
                expect(depCalls.logOperation.args[4]).toEqual({ clientId: meta.clientId});

                expect(depCalls.broadcast.calls).toEqual(1);
                expect(depCalls.broadcast.args[0]).toEqual(SocketMessageType.UPDATE_USERS);
                expect(depCalls.broadcast.args[1]).toEqual({ originatorId: meta.clientId });

                expect(createdObj).toEqual(Object.assign({}, newObj, { officialId: '4' }));

                restoreDeps();
                done();

            },
            err => {
                fail(err);
                restoreDeps();
                done();
            }
        );

    });

    it('should fail if given official ID already exists', (done) => {

        const meta = { clientId: '123' };

        const newObj = {
            _id : '000000000000000000000000'
        };
        (newObj as any).toObject = () => newObj;

        const existingObjs = [
            {
                _id : '000000000000000000000001',
                officialId: '1',
            },
            {
                _id : '000000000000000000000002',
                officialId: '2'
            }
        ];

        const fnCalls = {
            createSingleAction: 0,
            generateIdAction: 0,
            fetchLastIdAction: 0,
            fetchAllAction: 0
        };

        const fnStubs = {
            createSingleAction:     (officialId: string) => of(Object.assign({}, newObj, { officialId } ))
                .pipe( tap(() => fnCalls.createSingleAction++) ),

            generateIdAction:       (lastId: string|null = null): string => {
                fnCalls.generateIdAction++;
                return '3';
            },

            fetchLastIdAction:      of('2')
                .pipe( tap(() => fnCalls.fetchLastIdAction++) ),

            fetchAllAction:         of(existingObjs)
                .pipe( tap(() => fnCalls.fetchAllAction++) )
        };

        const fetchLastIdTempRef = GlobalVariableController.getLastCaseIdentifier;
        GlobalVariableController.getLastCaseIdentifier = () => fnStubs.fetchLastIdAction;

        const generateNextAccountIdentifierTempRef = EntityIdentifierGenerator.generateNextCaseIdentifier;
        EntityIdentifierGenerator.generateNextCaseIdentifier = fnStubs.generateIdAction;

        const restoreDeps = () => {
            GlobalVariableController.getLastCaseIdentifier = fetchLastIdTempRef;
            EntityIdentifierGenerator.generateNextCaseIdentifier = generateNextAccountIdentifierTempRef;
        };

        const params: ICreateOneParams = {
            createSingleAction: (officialId) => fnStubs.createSingleAction(officialId),
            logging: {
                resourceName: LogResourceName.USER,
                operation: LogOperation.CREATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_USERS
            },
            officialIdGeneration: {
                officialId: '2',
                fetchAllAction: () => fnStubs.fetchAllAction,
                globalVariableController: GlobalVariableController,
                entityIdentifierGenerator: EntityIdentifierGenerator
            }
        };

        createOne(params, meta).subscribe(
            (createdObj: any) => {
                fail('did not fail');
                restoreDeps();
                done();
            },
            err => {

                expect(err.name).toEqual(ErrorName.NON_UNIQUE_IDENTIFIER);
                expect(fnCalls.fetchAllAction).toEqual(1);
                expect(fnCalls.createSingleAction).toEqual(0);
                expect(depCalls.logOperation.calls).toEqual(0);
                expect(depCalls.broadcast.calls).toEqual(0);

                restoreDeps();
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
