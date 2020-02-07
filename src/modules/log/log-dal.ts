import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { userDalSingleton as UserDal } from '../user/user/user-dal';
import { userGroupDalSingleton as UserGroupDal } from '../user/user-group/user-group-dal';
import { roleDalSingleton as RoleDal } from '../user/role/role-dal';
import { contactDalSingleton as ContactDal } from '../contact/contact-dal';

import {LogResourceName} from './log-enums';
import {IOperationLog} from './log-interface';
import {
    IAnyEntityModel,
    IRoleLogModel,
    IUserGroupLogModel,
    IUserLogModel,
    IContactLogModel,
    RoleLog,
    UserGroupLog,
    UserLog,
    ContactLog
} from './log-model';

class OperationLogDal {

    constructor() {}

    getUserLogs(): Observable<IUserLogModel[]> {
        return from( UserLog.find({}) );
    }

    /**
     * Find all user logs associated to an User with _id <docId>, created at or after <date>,
     * sorted by descending datetime (most recent first)
     */
    getUserLogsByIdAfterDate(docId: string, date: Date): Observable<IUserLogModel[]> {
        const inputDate = new Date(date.toISOString());
        return from( UserLog.find({
            documentId: docId,
            datetime: { $gte: inputDate }
        })).pipe(
            map((logs: IUserLogModel[]) => {
                return logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
            })
        );
    }

    getUserLogById(logId: string): Observable<IUserLogModel> {
        return from( UserLog.findById(logId) );
    }

    addUserLog(logData: IOperationLog): Observable<IUserLogModel> {
        return from( UserLog.create(logData) );
    }

    getUserGroupLogs(): Observable<IUserGroupLogModel[]> {
        return from( UserGroupLog.find({}) );
    }

    /**
     * Find all user group logs associated to an UserGroup with _id <docId>, created at or after <date>,
     * sorted by descending datetime (most recent first)
     */
    getUserGroupLogsByIdAfterDate(docId: string, date: Date): Observable<IUserGroupLogModel[]> {
        const inputDate = new Date(date.toISOString());
        return from( UserGroupLog.find({
            documentId: docId,
            datetime: { $gte: inputDate }
        })).pipe(
            map((logs: IUserGroupLogModel[]) => {
                return logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
            })
        );
    }

    getUserGroupLogById(logId: string): Observable<IUserGroupLogModel> {
        return from( UserGroupLog.findById(logId) );
    }

    addUserGroupLog(logData: IOperationLog): Observable<IUserGroupLogModel> {
        return from( UserGroupLog.create(logData) );
    }

    getRoleLogs(): Observable<IRoleLogModel[]> {
        return from( RoleLog.find({}) );
    }

    /**
     * Find all role logs associated to a Role with _id <docId>, created at or after <date>,
     * sorted by descending datetime (most recent first)
     */
    getRoleLogsByIdAfterDate(docId: string, date: Date): Observable<IRoleLogModel[]> {
        const inputDate = new Date(date.toISOString());
        return from( RoleLog.find({
            documentId: docId,
            datetime: { $gte: inputDate }
        })).pipe(
            map((logs: IRoleLogModel[]) => {
                return logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
            })
        );
    }

    getRoleLogById(logId: string): Observable<IRoleLogModel> {
        return from( RoleLog.findById(logId) );
    }

    addRoleLog(logData: IOperationLog): Observable<IRoleLogModel> {
        return from( RoleLog.create(logData) );
    }

    getContactLogs(): Observable<IContactLogModel[]> {
        return from( ContactLog.find({}) );
    }

    /**
     * Find all contact logs associated to a Contact with _id <docId>, created at or after <date>,
     * sorted by descending datetime (most recent first)
     */
    getContactLogsByIdAfterDate(docId: string, date: Date): Observable<IContactLogModel[]> {
        const inputDate = new Date(date.toISOString());
        return from( ContactLog.find({
            documentId: docId,
            datetime: { $gte: inputDate }
        })).pipe(
            map((logs: IContactLogModel[]) => {
                return logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
            })
        );
    }

    getContactLogById(logId: string): Observable<IContactLogModel> {
        return from( ContactLog.findById(logId) );
    }

    addContactLog(logData: IOperationLog): Observable<IContactLogModel> {
        return from( ContactLog.create(logData) );
    }

    findDocumentByEntity(docId: string, entity: LogResourceName): Observable<IAnyEntityModel | null> {
        switch (entity) {
            case LogResourceName.USER:
                return UserDal.getUserById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.USER_GROUP:
                return UserGroupDal.getUserGroupById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.ROLE:
                return RoleDal.getRoleById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.CONTACT:
                return ContactDal.getContactById(docId) as Observable<IAnyEntityModel>;
        }
        return of(null);
    }

}

export const operationLogDalSingleton = new OperationLogDal();
