import {Observable, of, throwError} from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import SocketIOServer from '../../../shared/lib/socket.io/socket';
import {
    IUpdateRolesPayload,
    IUpdateUserGroupsPayload, IUpdateUsersPayload,
    SocketMessageType
} from '../../../shared/lib/socket.io/socket-types';

import { userGroupDalSingleton as UserGroupDal } from './user-group-dal';
import { IUserGroupModel } from './user-group-model';
import { IUserGroupUpdateBody, IUserGroupCreateBody } from './user-group-interface';
import { IReqMetadata } from '../../../shared/helpers/request-metadata-factory';
import {logControllerSingleton as LogController} from '../../log/log-controller';
import {LogOperation, LogResourceName} from '../../log/log-enums';
import {ErrorName} from '../../../shared/enums/errors';

class UserGroupController {

    constructor() { }

    getUserGroups(): Observable<IUserGroupModel[]> {
        return UserGroupDal.getUserGroups();
    }

    getUserGroupsWithRole(roleId: string): Observable<IUserGroupModel[]> {
        return UserGroupDal.getUserGroupsWithRole(roleId);
    }

    getUserGroupById(userGroupId: string): Observable<IUserGroupModel | null> {
        return UserGroupDal.getUserGroupById(userGroupId);
    }

    revertUserGroup(userGroupId: string, userGroupData: IUserGroupUpdateBody, meta: IReqMetadata = {}): Observable<IUserGroupModel> {
        return this.getUserGroupById(userGroupId).pipe(
            concatMap((oldUserGroup: IUserGroupModel) => {

                return UserGroupDal.updateUserGroup(userGroupId, userGroupData).pipe(
                    concatMap((group: IUserGroupModel) => {

                        return LogController.logOperation(LogResourceName.USER_GROUP, LogOperation.REVERT, oldUserGroup.toObject(), group.toObject(), meta)
                            .pipe( map(() => group) );

                    }),
                    concatMap((group: IUserGroupModel) => {

                        const data: IUpdateUserGroupsPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USER_GROUPS, data);

                        return of(group);

                    })
                );

            })
        );
    }

    updateUserGroup(userGroupId: string, userGroupData: IUserGroupUpdateBody, meta: IReqMetadata = {}): Observable<IUserGroupModel> {
        return this.getUserGroupById(userGroupId).pipe(
            concatMap((oldUserGroup: IUserGroupModel) => {

                return UserGroupDal.updateUserGroup(userGroupId, userGroupData).pipe(
                    concatMap((group: IUserGroupModel) => {

                        return LogController.logOperation(LogResourceName.USER_GROUP, LogOperation.UPDATE, oldUserGroup.toObject(), group.toObject(), meta)
                            .pipe( map(() => group) );

                    }),
                    concatMap((group: IUserGroupModel) => {

                        const data: IUpdateUserGroupsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USER_GROUPS, data);

                        return of(group);

                    })
                );

            })
        );
    }

    createUserGroup(userGroupData: IUserGroupCreateBody, meta: IReqMetadata = {}): Observable<IUserGroupCreateBody> {
        return UserGroupDal.createUserGroup(userGroupData).pipe(
            concatMap((group: IUserGroupModel) => {

                return LogController.logOperation(LogResourceName.USER_GROUP, LogOperation.CREATE, {}, group.toObject(), meta)
                    .pipe( map(() => group) );

            }),
            concatMap((group: IUserGroupModel) => {

                const data: IUpdateUserGroupsPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_USER_GROUPS, data);

                return of(group);

            })
        );
    }

    deleteUserGroup(userGroupId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getUserGroupById(userGroupId).pipe(
            concatMap((oldUserGroup: IUserGroupModel) => {

                if (oldUserGroup.userIds.length > 0) {
                    const err = new Error(`user group with id ${userGroupId} is referenced by one or more users`);
                    err.name = ErrorName.REFERENCED_ROLE;
                    return throwError(err);
                }
                else {

                    return UserGroupDal.deleteUserGroup(userGroupId).pipe(
                        concatMap((group: IUserGroupModel) => {

                            return LogController.logOperation(LogResourceName.USER_GROUP, LogOperation.DELETE, oldUserGroup.toObject(), group.toObject(), meta)
                                .pipe( map(() => group) );

                        }),
                        concatMap((group: IUserGroupModel) => {

                            const data: IUpdateUserGroupsPayload = {
                                originatorId: meta.clientId
                            };

                            SocketIOServer.broadcast(SocketMessageType.UPDATE_USER_GROUPS, data);

                            return of(group);

                        }),
                        map(() => true)
                    );

                }

            })
        );
    }

}

export const userGroupControllerSingleton = new UserGroupController();
