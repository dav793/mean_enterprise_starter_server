import { forkJoin, Observable, throwError, of } from 'rxjs';
import { map, mergeMap, concatMap } from 'rxjs/operators';

import SocketIOServer from '../../../shared/lib/socket.io/socket';
import { IUpdateRolesPayload, IUpdateUsersPayload, SocketMessageType } from '../../../shared/lib/socket.io/socket-types';

import { roleDalSingleton as RoleDal } from './role-dal';
import { IRoleModel } from './role-model';
import { IRoleUpdateBody, IRoleCreateBody } from './role-interface';
import { IReqMetadata } from '../../../shared/helpers/request-metadata-factory';
import { ErrorName } from '../../../shared/enums/errors';

import { userControllerSingleton as UserController } from '../user/user-controller';
import { userGroupControllerSingleton as UserGroupController } from '../user-group/user-group-controller';
import { logControllerSingleton as LogController } from '../../log/log-controller';
import { LogOperation, LogResourceName } from '../../log/log-enums';

class RoleController {

    constructor() {}

    getRoles(): Observable<IRoleModel[]> {
        return RoleDal.getRoles();
    }

    getRoleById(roleId: string): Observable<IRoleModel|null> {
        return RoleDal.getRoleById(roleId);
    }

    revertRole(roleId: string, roleData: IRoleUpdateBody, meta: IReqMetadata = {}): Observable<IRoleModel> {
        return this.getRoleById(roleId).pipe(
            concatMap((oldRole: IRoleModel) => {

                return RoleDal.updateRole(roleId, roleData).pipe(
                    concatMap((role: IRoleModel) => {

                        return LogController.logOperation(LogResourceName.ROLE, LogOperation.REVERT, oldRole.toObject(), role.toObject(), meta)
                            .pipe( map(() => role) );

                    }),
                    concatMap((role: IRoleModel) => {

                        const data: IUpdateRolesPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_ROLES, data);

                        return of(role);

                    })
                );

            })
        );
    }

    updateRole(roleId: string, roleData: IRoleUpdateBody, meta: IReqMetadata = {}): Observable<IRoleModel> {
        return this.getRoleById(roleId).pipe(
            concatMap((oldRole: IRoleModel) => {

                return RoleDal.updateRole(roleId, roleData).pipe(
                    concatMap((role: IRoleModel) => {

                        return LogController.logOperation(LogResourceName.ROLE, LogOperation.UPDATE, oldRole.toObject(), role.toObject(), meta)
                            .pipe( map(() => role) );

                    }),
                    concatMap((role: IRoleModel) => {

                        const data: IUpdateRolesPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_ROLES, data);

                        return of(role);

                    })
                );

            })
        );
    }

    createRole(roleData: IRoleCreateBody, meta: IReqMetadata = {}): Observable<IRoleModel> {
        return RoleDal.createRole(roleData).pipe(
            concatMap((role: IRoleModel) => {

                return LogController.logOperation(LogResourceName.ROLE, LogOperation.CREATE, {}, role.toObject(), meta)
                    .pipe( map(() => role) );

            }),
            concatMap((role: IRoleModel) => {

                const data: IUpdateRolesPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_ROLES, data);

                return of(role);

            })
        );
    }

    deleteRole(roleId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getRoleById(roleId).pipe(
            concatMap((oldRole: IRoleModel) => {

                return forkJoin(
                    UserController.getUsersWithRole(roleId),
                    UserGroupController.getUserGroupsWithRole(roleId)
                ).pipe(
                    mergeMap(([users, userGroups]) => {

                        if (
                            (users && users.length > 0) ||
                            (userGroups && userGroups.length > 0)
                        ) {
                            const err = new Error(`role with id ${roleId} is referenced by one or more users and/or user groups`);
                            err.name = ErrorName.REFERENCED_ROLE;
                            return throwError(err);
                        }
                        else {

                            return RoleDal.deleteRole(roleId).pipe(
                                concatMap((role: IRoleModel) => {

                                    return LogController.logOperation(LogResourceName.ROLE, LogOperation.DELETE, oldRole.toObject(), role.toObject(), meta)
                                        .pipe( map(() => role) );

                                }),
                                concatMap((role: IRoleModel) => {

                                    const data: IUpdateRolesPayload = {
                                        originatorId: meta.clientId
                                    };

                                    SocketIOServer.broadcast(SocketMessageType.UPDATE_ROLES, data);

                                    return of(role);

                                }),
                                map(() => true)
                            );

                        }

                    })
                );

            })
        );
    }

}

export const roleControllerSingleton = new RoleController();
