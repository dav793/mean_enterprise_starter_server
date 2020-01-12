import {Observable, of} from 'rxjs';
import {concatMap, map, tap} from 'rxjs/operators';

import SocketIOServer from '../../../shared/lib/socket.io/socket';
import {IUpdateRolesPayload, IUpdateUsersPayload, SocketMessageType} from '../../../shared/lib/socket.io/socket-types';

import {userDalSingleton as UserDal} from './user-dal';
import {IUserModel} from './user-model';
import {IUserRegisterBody, IUserUpdateBody} from './user-interface';
import {IReqMetadata} from '../../../shared/helpers/request-metadata-factory';
import {logControllerSingleton as LogController} from '../../log/log-controller';
import {LogOperation, LogResourceName} from '../../log/log-enums';

class UserController {

    constructor() { }

    getUsers(): Observable<IUserModel[]> {
        return UserDal.getUsers();
    }

    getUsersWithRole(roleId: string): Observable<IUserModel[]> {
        return UserDal.getUsersWithRole(roleId);
    }

    getUserById(userId: string): Observable<IUserModel | null> {
        return UserDal.getUserById(userId);
    }

    revertUser(userId: string, userData: IUserUpdateBody, meta: IReqMetadata = {}): Observable<IUserModel> {
        return this.getUserById(userId).pipe(
            concatMap((oldUser: IUserModel) => {

                return UserDal.updateUser(userId, userData).pipe(
                    concatMap((user: IUserModel) => {

                        return LogController.logOperation(LogResourceName.USER, LogOperation.REVERT, oldUser.toObject(), user.toObject(), meta)
                            .pipe( map(() => user) );

                    }),
                    concatMap((user: IUserModel) => {

                        const data: IUpdateUsersPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                        return of(user);

                    })
                );

            })
        );
    }

    updateUser(userId: string, userData: IUserUpdateBody, meta: IReqMetadata = {}): Observable<IUserModel> {
        return this.getUserById(userId).pipe(
            concatMap((oldUser: IUserModel) => {

                return UserDal.updateUser(userId, userData).pipe(
                    concatMap((user: IUserModel) => {

                        return LogController.logOperation(LogResourceName.USER, LogOperation.UPDATE, oldUser.toObject(), user.toObject(), meta)
                            .pipe( map(() => user) );

                    }),
                    concatMap((user: IUserModel) => {

                        const data: IUpdateUsersPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                        return of(user);

                    })
                );

            })
        );
    }

    createUser(userData: IUserRegisterBody, meta: IReqMetadata = {}): Observable<IUserModel> {
        return UserDal.createUser(userData).pipe(
            concatMap((user: IUserModel) => {

                return LogController.logOperation(LogResourceName.USER, LogOperation.CREATE, {}, user.toObject(), meta)
                    .pipe( map(() => user) );

            }),
            concatMap((user: IUserModel) => {

                const data: IUpdateUsersPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                return of(user);

            })
        );
    }

    deleteUser(userId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getUserById(userId).pipe(
            concatMap((oldUser: IUserModel) => {

                return UserDal.deleteUser(userId).pipe(
                    concatMap((user: IUserModel) => {

                        return LogController.logOperation(LogResourceName.USER, LogOperation.DELETE, oldUser.toObject(), user.toObject(), meta)
                            .pipe( map(() => user) );

                    }),
                    concatMap((user: IUserModel) => {

                        const data: IUpdateRolesPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                        return of(user);

                    }),
                    map(() => true)
                );

            })
        );
    }

}

export const userControllerSingleton = new UserController();
