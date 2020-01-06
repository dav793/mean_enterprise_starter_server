
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { mongoServer } from '../../../../shared/helpers/mongodb-memory-server';

import { UserGroup, IUserGroupModel } from '../user-group-model';
import { userGroupDalSingleton as UserGroupDal } from '../user-group-dal';

import { ErrorName } from '../../../../shared/enums/errors';

const dataset = require('./datasets/default');

describe('UserGroupDal => getUserGroups', () => {

    it('should find user groups in DB', (done) => {

        UserGroupDal.getUserGroups()
            .subscribe((groups: IUserGroupModel[]) => {

                expect(groups).toEqual(jasmine.any(Array));
                expect(groups.length).toEqual(1);
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('UserGroupDal => getUserGroupsByUserId', () => {

    it('should find user groups in DB', (done) => {

        UserGroupDal.getUserGroupsByUserId('100000000000000000000000')
            .subscribe((groups: IUserGroupModel[]) => {

                expect(groups).toEqual(jasmine.any(Array));
                expect(groups.length).toEqual(1);
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('UserGroupDal => getUserGroupById', () => {

    it('should find user group in DB', (done) => {

        UserGroupDal.getUserGroupById('000000000000000000000000')
            .subscribe((group: IUserGroupModel) => {

                expect(group._id.toString()).toEqual('000000000000000000000000');
                expect(group.label).toEqual('User Group A');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should emit null if no role found with id', (done) => {

        UserGroupDal.getUserGroupById('990000000000000000000000')
            .subscribe((group: IUserGroupModel) => {
                expect(group).toBeNull();
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        UserGroupDal.getUserGroupById('INVALID ID FORMAT')
            .subscribe((group: IUserGroupModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.CAST_ERROR);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('UserGroupDal => createUserGroup', () => {

    it('should create user group in DB and emit created user group', (done) => {

        const reqBody = {
            _id : '000000000000000000000001',
            label : 'User Group B',
            userIds : [
                '100000000000000000000000'
            ],
            roleIds : [
                '200000000000000000000000'
            ]
        };

        UserGroupDal.createUserGroup(reqBody)
            .subscribe((group: IUserGroupModel) => {
                expect(group.label).toEqual('User Group B');
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('UserGroupDal => updateUserGroup', () => {

    it('should update user group in DB and emit updated user group', (done) => {

        const reqBody = {
            label : 'User Group B'
        };

        UserGroupDal.updateUserGroup('000000000000000000000000', reqBody)
            .subscribe((group: IUserGroupModel) => {

                expect(group._id.toString()).toEqual('000000000000000000000000');
                expect(group.label).toEqual('User Group B');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw IdNotFound error if no user group found with id', (done) => {

        const reqBody = {};

        UserGroupDal.updateUserGroup('990000000000000000000000', reqBody)
            .subscribe((group: IUserGroupModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.ID_NOT_FOUND);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        const reqBody = {};

        UserGroupDal.updateUserGroup('INVALID ID FORMAT', reqBody)
            .subscribe((group: IUserGroupModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.CAST_ERROR);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

const loadDataset = () => from( UserGroup.create(dataset.userGroups) );

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
