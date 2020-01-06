import {forkJoin, from, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { mongoServer } from '../../../shared/helpers/mongodb-memory-server';

import { operationLogDalSingleton as LogDal } from '../log-dal';

import { ErrorName } from '../../../shared/enums/errors';
import { LogOperation, LogResourceName } from '../log-enums';
import {
    IUserLogModel,
    IRoleLogModel,
    IUserGroupLogModel,
    UserLog,
    RoleLog,
    UserGroupLog
} from '../log-model';

const dataset = require('./datasets/log-dal');

describe('LogDal => getUserLogsByIdAfterDate', () => {

    it('should correctly find all user logs at and after a given date', (done) => {

        const date = new Date(2019, 6, 3, 21, 10, 40);
        LogDal.getUserLogsByIdAfterDate('123', date)
            .subscribe(
                (logs: IUserLogModel[]) => {

                    expect(logs).toBeDefined();
                    expect(logs.length).toEqual(3);
                    expect(logs[0]._id.toString()).toEqual('000000000000000000000002');
                    expect(logs[1]._id.toString()).toEqual('000000000000000000000001');
                    expect(logs[2]._id.toString()).toEqual('000000000000000000000003');
                    done();

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
