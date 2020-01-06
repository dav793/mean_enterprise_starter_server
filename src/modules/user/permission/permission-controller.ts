
import { Observable, from, throwError, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { userDalSingleton as UserDal } from '../user/user-dal';
import { userGroupDalSingleton as UserGroupDal } from '../user-group/user-group-dal';

import { IRoleModel } from '../role/role-model';
import { ResourceName } from '../../../shared/enums/resources';
import { roleDalSingleton as RoleDal } from '../role/role-dal';
import { IPermission, IResourcePermissions } from '../role/role-interface';
import { PermissionLevel, PermissionAction } from './permission-enums';

import { ErrorName } from '../../../shared/enums/errors';
import { removeArrayDuplicates } from '../../../shared/helpers/array-utils';

class PermissionController {

    constructor() {}

    getUserPermissions(userId: string): Observable<IResourcePermissions[]> {
        return forkJoin([
            UserDal.getUserById(userId),
            UserGroupDal.getUserGroupsByUserId(userId)
        ]).pipe(
            switchMap(([user, groups]) => {
                if (user) {
                    // Then the user was found
                    // create a list of distinct role ids from user roles + groups roles
                    let roleIds = user.roleIds || [];

                    groups.forEach(g => {
                        roleIds = roleIds.concat(g.roleIds || []);
                    });

                    roleIds = removeArrayDuplicates(roleIds);

                    // get roles
                    return forkJoin(
                        roleIds.map(roleId => RoleDal.getRoleById(roleId))
                    ).pipe(
                        switchMap(roles => {
                            const perms = this.combinePermissions(roles);
                            return from([perms]);
                        })
                    );

                }
                else {
                    const err = new Error(`user with id ${userId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })

        );

    }

    combinePermissions(roles: IRoleModel[]): IResourcePermissions[] {

        const combined = [];

        roles.forEach(role => {

            role.resources.forEach((resource: IResourcePermissions) => {

                // for each resource of each role...

                // find existing resource in combined result
                const existingResource = combined.find(c => c.name === resource.name);
                if (!existingResource) {
                    combined.push(resource);    // add if not exists
                    return;
                }

                Object.keys(PermissionAction).forEach(action => {
                    if (!action)
                        return;

                    const existingPerm = existingResource.permissions.find(p => p.action === PermissionAction[action]);
                    const newPerm = resource.permissions.find(p => p.action === PermissionAction[action]);

                    if (!existingPerm && !newPerm)
                        return;
                    else if (!existingPerm && newPerm)
                        existingResource.permissions.push(newPerm);
                    else if (existingPerm && newPerm)
                        existingPerm.level = Math.max(existingPerm.level, newPerm ? newPerm.level : PermissionLevel.DENY);
                });

            });

        });

        return combined;

    }

    getResourcePermissions(perms: IResourcePermissions[], resource: ResourceName): IPermission[] {
        const res = perms.find(p => p.name === resource);
        if (!res)
            return [];
        return res.permissions;
    }

    getResourceActionPermission(perms: IResourcePermissions[], resource: ResourceName, action: PermissionAction): IPermission {
        const resPerms = this.getResourcePermissions(perms, resource);
        const perm = resPerms.find(p => p.action === action);
        if (!perm)
            return { action, level: PermissionLevel.DENY };
        return perm;
    }

}

export const permissionControllerSingleton = new PermissionController();
