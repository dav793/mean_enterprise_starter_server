
import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserGroup, IUserGroupModel } from './user-group-model';
import { IUserGroupCreateBody, IUserGroupUpdateBody } from './user-group-interface';
import { ErrorName } from '../../../shared/enums/errors';

export class UserGroupDal {

    constructor() {}

    getUserGroups(): Observable<IUserGroupModel[]> {
        return from( UserGroup.find({ deleted: { $ne: true } }) );
    }

    getUserGroupsWithRole(roleId: string): Observable<IUserGroupModel[]> {
        const query = {
            roleIds: { $elemMatch: { $eq: roleId } },
            deleted: { $ne: true }
        };
        return from( UserGroup.find(query) );
    }

    getUserGroupsByUserId(userId: string): Observable<IUserGroupModel[]> {
        const query = {
            userIds: { $all: [userId] },
            deleted: { $ne: true }
        };
        return from( UserGroup.find(query) );
    }

    getUserGroupById(userGroupId: string): Observable<IUserGroupModel|null> {
        return from( UserGroup.findById(userGroupId) );
    }

    createUserGroup(userGroupData: IUserGroupCreateBody): Observable<IUserGroupModel> {
        return from( UserGroup.create(userGroupData) );
    }

    updateUserGroup(userGroupId: string, userGroupData: IUserGroupUpdateBody): Observable<IUserGroupModel> {
        return this.getUserGroupById(userGroupId).pipe(

            switchMap(userGroup => {
                if (userGroup) {

                    return from( UserGroup.findByIdAndUpdate(userGroupId, userGroupData, {new: true}) );

                }
                else {
                    const err = new Error(`user group with id ${userGroupId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })

        );
    }

    deleteUserGroup(userGroupId: string): Observable<IUserGroupModel> {
        return this.updateUserGroup(userGroupId, { deleted: true } as any);
    }

}

export const userGroupDalSingleton = new UserGroupDal();
