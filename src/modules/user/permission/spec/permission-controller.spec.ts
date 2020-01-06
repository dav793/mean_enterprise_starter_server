import {forkJoin, from} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {mongoServer} from '../../../../shared/helpers/mongodb-memory-server';

import {User} from '../../user/user-model';
import {UserGroup} from '../../user-group/user-group-model';
import {IRoleModel, Role} from '../../role/role-model';

import {permissionControllerSingleton as PermissionController} from '../permission-controller';
import {PermissionAction, PermissionLevel} from '../permission-enums';
import {ResourceName} from '../../../../shared/enums/resources';
import {IResourcePermissions} from '../../role/role-interface';

const dataset = require('./datasets/default');

describe('PermissionController => getUserPermissions', () => {

    it('should correctly provide all existing permissions for all roles of an user and her user groups', (done) => {

        PermissionController.getUserPermissions('000000000000000000000000')
            .subscribe(
                (perms: IResourcePermissions[]) => {

                    expect(perms).toEqual(jasmine.anything());

                    const resourceA = perms.find(p => p.name === 'ResourceA' as ResourceName);
                    const resourceB = perms.find(p => p.name === 'ResourceB' as ResourceName);
                    if (!resourceA || !resourceB) {
                        fail('resource not found');
                        done();
                    }

                    // test resource A perms
                    const rAcreatePerm = resourceA.permissions.find(p => p.action === PermissionAction.CREATE);
                    const rAreadPerm = resourceA.permissions.find(p => p.action === PermissionAction.READ);
                    const rAupdatePerm = resourceA.permissions.find(p => p.action === PermissionAction.UPDATE);
                    const rAdeletePerm = resourceA.permissions.find(p => p.action === PermissionAction.DELETE);

                    expect(rAcreatePerm.level === PermissionLevel.DENY).toBe(true);
                    expect(rAreadPerm.level === PermissionLevel.ALLOW).toBe(true);
                    expect(rAupdatePerm.level === PermissionLevel.ALLOW).toBe(true);
                    expect(rAdeletePerm.level === PermissionLevel.DENY).toBe(true);

                    // test resource B perms
                    const rBcreatePerm = resourceB.permissions.find(p => p.action === PermissionAction.CREATE);
                    const rBreadPerm = resourceB.permissions.find(p => p.action === PermissionAction.READ);
                    const rBupdatePerm = resourceB.permissions.find(p => p.action === PermissionAction.UPDATE);
                    const rBdeletePerm = resourceB.permissions.find(p => p.action === PermissionAction.DELETE);

                    expect(rBcreatePerm.level === PermissionLevel.DENY).toBe(true);
                    expect(rBreadPerm.level === PermissionLevel.DENY).toBe(true);
                    expect(rBupdatePerm.level === PermissionLevel.DENY).toBe(true);
                    expect(rBdeletePerm.level === PermissionLevel.ALLOW).toBe(true);

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

describe('PermissionController => combinePermissions', () => {

    it('should combine permissions from several roles', (done) => {

        from(Role.find({
            $or: [
                {_id: '200000000000000000000000'},
                {_id: '200000000000000000000001'}
            ]
        })).subscribe((roles: IRoleModel[]) => {

            const perms = PermissionController.combinePermissions(roles);

            expect(perms).toEqual(jasmine.anything());

            const resource = perms.find(p => p.name === 'ResourceA' as ResourceName);
            if (!resource) {
                fail('resource not found');
                done();
            }

            const createPerm = resource.permissions.find(p => p.action === PermissionAction.CREATE);
            const readPerm = resource.permissions.find(p => p.action === PermissionAction.READ);
            const updatePerm = resource.permissions.find(p => p.action === PermissionAction.UPDATE);
            const deletePerm = resource.permissions.find(p => p.action === PermissionAction.DELETE);

            expect(createPerm.level === PermissionLevel.DENY).toBe(true);
            expect(readPerm.level === PermissionLevel.ALLOW).toBe(true);
            expect(updatePerm.level === PermissionLevel.ALLOW).toBe(true);
            expect(deletePerm.level === PermissionLevel.DENY).toBe(true);

            done();

        });

    });

    it('should combine permissions from several roles where permission is missing from one or more roles', (done) => {

        from(Role.find({
                $or: [
                    {_id: '200000000000000000000000'},
                    {_id: '200000000000000000000001'}
                ]
        })).subscribe((roles: IRoleModel[]) => {

            const perms = PermissionController.combinePermissions(roles);

            expect(perms).toEqual(jasmine.anything());

            const resource = perms.find(p => p.name === 'ResourceB' as ResourceName);
            if (!resource) {
                fail('resource not found');
                done();
            }

            const createPerm = resource.permissions.find(p => p.action === PermissionAction.CREATE);
            const readPerm = resource.permissions.find(p => p.action === PermissionAction.READ);
            const updatePerm = resource.permissions.find(p => p.action === PermissionAction.UPDATE);
            const deletePerm = resource.permissions.find(p => p.action === PermissionAction.DELETE);

            expect(createPerm.level === PermissionLevel.DENY).toBe(true);
            expect(readPerm.level === PermissionLevel.DENY).toBe(true);
            expect(updatePerm.level === PermissionLevel.DENY).toBe(true);
            expect(deletePerm.level === PermissionLevel.ALLOW).toBe(true);

            done();

        });

    });

    // @todo: escribir prueba para cuando ningun rol tiene el permiso para el recurso

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('PermissionController => getResourceActionPermission', () => {

    it('should extract permission for specific resource and action', () => {

        const perms = [
            {
                name: 'ResourceA' as ResourceName,
                permissions: [
                    {
                        action: PermissionAction.CREATE,
                        level: PermissionLevel.ALLOW
                    }
                ]
            }
        ];

        const perm = PermissionController.getResourceActionPermission(perms, 'ResourceA' as ResourceName, PermissionAction.CREATE);

        expect(perm).toEqual(jasmine.anything());
        expect(perm.action).toEqual(PermissionAction.CREATE);
        expect(perm.level).toEqual(PermissionLevel.ALLOW);

    });

    it('should provide minimum permission for specific resource and action where permission does not exist', () => {

        const perms = [];

        const perm = PermissionController.getResourceActionPermission(perms, 'ResourceA' as ResourceName, PermissionAction.CREATE);

        expect(perm).toEqual(jasmine.anything());
        expect(perm.action).toEqual(PermissionAction.CREATE);
        expect(perm.level).toEqual(PermissionLevel.DENY);

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
