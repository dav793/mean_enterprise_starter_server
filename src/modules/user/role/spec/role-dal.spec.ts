
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { mongoServer } from '../../../../shared/helpers/mongodb-memory-server';

import { Role, IRoleModel } from '../role-model';
import { roleDalSingleton as RoleDal } from '../role-dal';
import { ErrorName } from '../../../../shared/enums/errors';
import { ResourceName } from '../../../../shared/enums/resources';

const dataset = require('./datasets/default');

describe('RoleDal => getRoles', () => {

    it('should find roles in DB', (done) => {

        RoleDal.getRoles()
            .subscribe((roles: IRoleModel[]) => {

                expect(roles).toEqual(jasmine.any(Array));
                expect(roles.length).toEqual(1);
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('RoleDal => getRoleById', () => {

    it('should find role in DB', (done) => {

        RoleDal.getRoleById('000000000000000000000000')
            .subscribe((role: IRoleModel) => {

                expect(role._id.toString()).toEqual('000000000000000000000000');
                expect(role.name).toEqual('Role A');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should emit null if no role found with id', (done) => {

        RoleDal.getRoleById('990000000000000000000000')
            .subscribe((role: IRoleModel) => {
                expect(role).toBeNull();
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        RoleDal.getRoleById('INVALID ID FORMAT')
            .subscribe((role: IRoleModel) => {
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

describe('RoleDal => getRoleByName', () => {

    it('should find role in DB', (done) => {

        RoleDal.getRoleByName('Role A')
            .subscribe((role: IRoleModel) => {

                expect(role._id.toString()).toEqual('000000000000000000000000');
                expect(role.name).toEqual('Role A');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should emit null if no role found with name', (done) => {

        RoleDal.getRoleByName('Role Z')
            .subscribe((role: IRoleModel) => {
                expect(role).toBeNull();
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('RoleDal => updateRole', () => {

    it('should update role in DB and emit updated role', (done) => {

        const reqBody = {
            name: 'Role X'
        };

        RoleDal.updateRole('000000000000000000000000', reqBody)
            .subscribe((role: IRoleModel) => {

                expect(role._id.toString()).toEqual('000000000000000000000000');
                expect(role.name).toEqual('Role X');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw IdNotFound error if no role found with id', (done) => {

        const reqBody = {};

        RoleDal.updateRole('990000000000000000000000', reqBody)
            .subscribe((role: IRoleModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.ID_NOT_FOUND);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        const reqBody = {};

        RoleDal.updateRole('INVALID ID FORMAT', reqBody)
            .subscribe((role: IRoleModel) => {
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

describe('RoleDal => createRole', () => {

    it('should create role in DB and emit created role', (done) => {

        const reqBody = {
            name: 'Role X',
            resources: [{
                name: 'Resource X' as ResourceName,
                permissions: []
            }]
        };

        RoleDal.createRole(reqBody)
            .subscribe((role: IRoleModel) => {
                expect(role.name).toEqual('Role X');
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

const loadDataset = () => from( Role.create(dataset.roles) );

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
