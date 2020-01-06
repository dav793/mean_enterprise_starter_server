import { Observable, from, throwError, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User, IUserModel } from './user-model';
import { IUserRegisterBody, IUserUpdateBody } from './user-interface';
import { Role, IRoleModel, DefaultRoleName } from '../role/role-model';
import { ErrorName } from '../../../shared/enums/errors';

import { getSalt, getHash } from '../../../shared/helpers/crypto-utils';

class UserDal {

    constructor() { }

    getUsers(): Observable<IUserModel[]> {
        return from(User.find({}).select('-hash -salt'));
    }

    getUsersWithRole(roleId: string): Observable<IUserModel[]> {
        const query = { roleIds: { $elemMatch: { $eq: roleId } } };
        return from( User.find(query).select('-hash -salt') );
    }

    getUserById(userId: string): Observable<IUserModel | null> {
        return from( User.findById(userId).select('-hash -salt') );
    }

    updateUser(userId: string, userData: IUserUpdateBody): Observable<IUserModel> {
        return this.getUserById(userId).pipe(
            switchMap((user: IUserModel) => {
                if (user) {

                    user.firstName = userData.firstName ? userData.firstName : user.firstName;
                    user.lastName = userData.lastName ? userData.lastName : user.lastName;
                    user.email = userData.email ? userData.email : user.email;
                    user.roleIds = userData.roleIds ? userData.roleIds : user.roleIds;
                    user.updatePassword = userData.updatePassword || false;

                    return from(user.save());

                }
                else {
                    const err = new Error(`user with id ${userId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })

        );
    }

    createUser(userData: IUserRegisterBody): Observable<IUserModel> {
        return forkJoin(
            User.findOne({ username: userData.username }),
            Role.findOne({ name: DefaultRoleName })
        ).pipe(
            switchMap(([existingUser, defaultRole]) => {
                if (!existingUser) {
                    const user = new User();

                    user.username = userData.username;
                    user.firstName = userData.firstName;
                    user.lastName = userData.lastName;
                    user.email = userData.email;
                    user.roleIds = userData.roleIds || defaultRole ? [defaultRole._id.toString()] : [];
                    user.updatePassword = true;

                    if (userData.password) {
                        user.salt = getSalt();
                        user.hash = getHash(user.salt.toString(), userData.password);
                        user.updatePassword = false;
                        return from(user.save());
                    }
                    else {
                        const err = new Error('must set a password');
                        err.name = ErrorName.PASSWORD_MISSING;
                        return throwError(err);
                    }

                }
                else {
                    const err = new Error('username must be unique');
                    err.name = ErrorName.NON_UNIQUE_USERNAME;
                    return throwError(err);
                }
            })

        );
    }

    deleteUser(userId: string): Observable<IUserModel> {
        return this.updateUser(userId, { deleted: true } as any);
    }

}

export const userDalSingleton = new UserDal();
