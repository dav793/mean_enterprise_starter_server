import {forkJoin, from} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {mongoServer} from '../../../../shared/helpers/mongodb-memory-server';

import {User} from '../../user/user-model';
import {UserGroup} from '../../user-group/user-group-model';
import {Role} from '../../role/role-model';

import {permissionExpressLayerSingleton as PermissionExpressLayer} from '../permission-express';
import {PermissionAction, PermissionLevel} from '../permission-enums';
import {ResourceName} from '../../../../shared/enums/resources';

const dataset = require('./datasets/default');

describe('PermissionExpressLayer => authorize', () => {

    it('should correctly allow an authorized request', (done) => {

        // prep mock dependencies
        const mReq = {
            user: {_id: '000000000000000000000000'}
        };

        const mRes = {
            sendStatus: (code: number) => ((code2: number) => {
                fail(`authentication failed with status ${code2}`);
                done();
            })
        };

        const mNext = (err?) => {
            if (err) {
                fail(err);
                done();
            }

            expect(err).toBe(undefined);
            done();
        };

        // test middleware function
        PermissionExpressLayer.authorize('ResourceA' as ResourceName, PermissionAction.READ, PermissionLevel.ALLOW)(
            mReq as any,
            mRes as any,
            mNext
        );

    });

    it('should correctly deny an unauthorized request', (done) => {

        // prep mock dependencies
        const mReq = {
            user: {_id: '000000000000000000000000'}
        };

        const mRes = {
            sendStatus: (code: number) => {
                expect(code).toEqual(403);
                done();
            }
        };

        const mNext = (err?) => {
            if (err) {
                fail(err);
                done();
            }

            fail('request was not blocked');
            done();
        };

        // test middleware function
        PermissionExpressLayer.authorize('ResourceA' as ResourceName, PermissionAction.CREATE, PermissionLevel.ALLOW)(
            mReq as any,
            mRes as any,
            mNext
        );

    });

    it('should deny a request for a resource/action/level triplet for which a permission does not exist', (done) => {

        // prep mock dependencies
        const mReq = {
            user: {_id: '000000000000000000000000'}
        };

        const mRes = {
            sendStatus: (code: number) => {
                expect(code).toEqual(403);
                done();
            }
        };

        const mNext = (err?) => {
            if (err) {
                fail(err);
                done();
            }

            fail('request was not blocked');
            done();
        };

        // test middleware function
        PermissionExpressLayer.authorize('ResourceZ' as ResourceName, PermissionAction.CREATE, PermissionLevel.ALLOW)(
            mReq as any,
            mRes as any,
            mNext
        );

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

const loadDataset = () => forkJoin([
    from( User.create(dataset.users) ),
    from( UserGroup.create(dataset.userGroups) ),
    from( Role.create(dataset.roles) ),
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
