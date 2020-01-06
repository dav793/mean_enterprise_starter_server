import { forkJoin, from } from 'rxjs';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import { mongoServer } from '../../../shared/helpers/mongodb-memory-server';

import { logControllerSingleton as LogController } from '../log-controller';
import { operationLogDalSingleton as LogDal } from '../log-dal';
import { LogOperation, LogResourceName } from '../log-enums';
import { IUserLogModel, RoleLog, UserGroupLog, UserLog } from '../log-model';

import { User } from '../../user/user/user-model';
import { userControllerSingleton as UserController } from '../../user/user/user-controller';

import { UserGroup } from '../../user/user-group/user-group-model';

import { Role } from '../../user/role/role-model';

const dataset = require('./datasets/log-controller.integration');

describe('LogController => integration', () => {

    it('should correctly log an UPDATE operation after a call to UserController.updateUser', (done) => {

        const updateBody = {
            "_id" : "000000000000000000000000",
            "firstName" : "Fname3",
            "lastName" : "Lname1",
            "secondLastName" : "",
            "email" : "test@test.com",
            "roleIds" : [
                "100000000000000000000001",
                "100000000000000000000000"
            ],
            "updatePassword" : false,
            "deleted" : false,
            "username" : "test1",
            "salt" : "f2806823faa4f1aeea992cdaa04090b5",
            "hash" : "0b19be135c1aeab6f000395298b032a3b798e2d892970107f496285aec1e9d3f96015b4c4e0c9e318c1d4e195b154a2adbf7381d17f90571d864b153f483a2a0",
            "createdAt" : new Date(2019, 11, 21, 17, 18, 41),
            "updatedAt" : new Date(2019, 11, 21, 17, 18, 41),
            "__v" : 1
        };

        UserController.updateUser("000000000000000000000000", updateBody, {userId: '123'}).pipe(
            switchMap((user) => LogDal.getUserLogs())
        ).subscribe(
            (logs: IUserLogModel[]) => {

                logs = logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
                expect(logs).toBeDefined();
                expect(logs.length).toEqual(4);
                expect(logs[0].documentId).toEqual("000000000000000000000000");
                expect(logs[0].entity).toEqual(LogResourceName.USER);
                expect(logs[0].operation).toEqual(LogOperation.UPDATE);
                expect(logs[0].userId).toEqual('123');
                expect(logs[0].changes).toBeDefined();
                expect(Object.keys(logs[0].changes).length).toEqual(3);
                expect(Object.keys(logs[0].changes)).toContain('firstName');
                expect(logs[0].changes.firstName).toEqual('Fname3');
                expect(Object.keys(logs[0].changes)).toContain('roleIds');
                expect(logs[0].changes.roleIds).toEqual([
                    '100000000000000000000001',
                    '100000000000000000000000'
                ]);
                done();

            },
            err => {
                fail(err);
                done();
            }
        );

    });

    it('should correctly revert a document state back one log entry', (done) => {

        LogDal.getUserLogs().subscribe(
            (logs: IUserLogModel[]) => {

                const targetLogEntry = logs.find(l => l._id.toString() === '010000000000000000000001');

                LogController.revertDocumentState(targetLogEntry, {userId: '123'}).pipe(
                    switchMap(() => forkJoin([
                        UserController.getUserById('000000000000000000000000'),
                        LogDal.getUserLogs()
                    ]))
                ).subscribe(
                    ([user, logs]) => {

                        // logs = logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
                        // console.log(logs.map(l => {
                        //     return {_id: l._id.toString(), datetime: l.datetime};
                        // }));
                        // console.log(logs[0].changes);

                        expect(user.firstName).toEqual('Fname2');
                        expect(user.lastName).toEqual('Lname1');
                        expect(user.roleIds.length).toEqual(2);
                        expect(user.roleIds).toContain('100000000000000000000001');
                        expect(user.roleIds).toContain('100000000000000000000000');

                        logs = logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
                        expect(logs.length).toEqual(4);
                        expect(logs[0].operation).toEqual(LogOperation.REVERT);
                        expect(logs[0].entity).toEqual(LogResourceName.USER);
                        expect(logs[0].documentId).toEqual('000000000000000000000000');
                        expect(logs[0].userId).toEqual('123');
                        expect(Object.keys(logs[0].changes).length).toEqual(2);
                        expect(Object.keys(logs[0].changes)).toContain('roleIds');
                        expect(logs[0].changes.roleIds.length).toEqual(2);
                        expect(logs[0].changes.roleIds).toContain('100000000000000000000001');
                        expect(logs[0].changes.roleIds).toContain('100000000000000000000000');
                        expect(Object.keys(logs[0].changes)).toContain('__v');
                        done();

                    },
                    err => {
                        fail(err);
                        done();
                    }
                );

            },
            err => {
                fail(err);
                done();
            }
        );

    });

    it('should correctly revert a document state several log entries back', (done) => {

        LogDal.getUserLogs().subscribe(
            (logs: IUserLogModel[]) => {

                const targetLogEntry = logs.find(l => l._id.toString() === '010000000000000000000000');

                LogController.revertDocumentState(targetLogEntry, {userId: '123'}).pipe(
                    switchMap(() => forkJoin([
                        UserController.getUserById('000000000000000000000000'),
                        LogDal.getUserLogs()
                    ]))
                ).subscribe(
                    ([user, logs]) => {

                        expect(user.firstName).toEqual('Fname1');
                        expect(user.lastName).toEqual('Lname1');
                        expect(user.roleIds.length).toEqual(1);
                        expect(user.roleIds).toContain('100000000000000000000000');

                        logs = logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
                        expect(logs.length).toEqual(4);
                        expect(logs[0].operation).toEqual(LogOperation.REVERT);
                        expect(logs[0].entity).toEqual(LogResourceName.USER);
                        expect(logs[0].documentId).toEqual('000000000000000000000000');
                        expect(logs[0].userId).toEqual('123');
                        expect(Object.keys(logs[0].changes).length).toEqual(3);
                        expect(Object.keys(logs[0].changes)).toContain('firstName');
                        expect(logs[0].changes.firstName).toEqual('Fname1');
                        expect(Object.keys(logs[0].changes)).toContain('roleIds');
                        expect(logs[0].changes.roleIds).toContain('100000000000000000000000');
                        expect(Object.keys(logs[0].changes)).toContain('__v');
                        done();

                    },
                    err => {
                        fail(err);
                        done();
                    }
                );

            },
            err => {
                fail(err);
                done();
            }
        );

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

const loadDataset = () => forkJoin([
    from( User.create(dataset.users) ),
    from( UserGroup.create(dataset.usergroups) ),
    from( Role.create(dataset.roles) ),
    from( UserLog.create(dataset.userlogs) ),
    from( UserGroupLog.create(dataset.usergrouplogs) ),
    from( RoleLog.create(dataset.rolelogs) )
]);

const connectDb = (done) => {
    mongoServer.createConnection().pipe(
        switchMap(() => loadDataset())
    ).subscribe(
        () => done(),
        err => {
            fail(err);
            done();
        }
    );
};

const disconnectDb = () => mongoServer.destroyConnection();
