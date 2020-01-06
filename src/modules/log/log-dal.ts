import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { userDalSingleton as UserDal } from '../user/user/user-dal';
import { userGroupDalSingleton as UserGroupDal } from '../user/user-group/user-group-dal';
import { roleDalSingleton as RoleDal } from '../user/role/role-dal';
import { physicalContactDalSingleton as PhysicalContactDal } from '../contact/physical-contact-dal';
import { corporateContactDalSingleton as CorporateContactDal } from '../contact/corporate-contact-dal';

import {LogResourceName} from './log-enums';
import {IOperationLog} from './log-interface';
import {
    IAnyEntityModel,
    IRoleLogModel,
    IUserGroupLogModel,
    IUserLogModel,
    IPhysicalContactLogModel,
    ICorporateContactLogModel,
    RoleLog,
    UserGroupLog,
    UserLog,
    PhysicalContactLog,
    CorporateContactLog
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

    getPhysicalContactLogs(): Observable<IPhysicalContactLogModel[]> {
        return from( PhysicalContactLog.find({}) );
    }

    /**
     * Find all physical contact logs associated to a Physical Contact with _id <docId>, created at or after <date>,
     * sorted by descending datetime (most recent first)
     */
    getPhysicalContactLogsByIdAfterDate(docId: string, date: Date): Observable<IPhysicalContactLogModel[]> {
        const inputDate = new Date(date.toISOString());
        return from( PhysicalContactLog.find({
            documentId: docId,
            datetime: { $gte: inputDate }
        })).pipe(
            map((logs: IPhysicalContactLogModel[]) => {
                return logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
            })
        );
    }

    getPhysicalContactLogById(logId: string): Observable<IPhysicalContactLogModel> {
        return from( PhysicalContactLog.findById(logId) );
    }

    addPhysicalContactLog(logData: IOperationLog): Observable<IPhysicalContactLogModel> {
        return from( PhysicalContactLog.create(logData) );
    }

    getCorporateContactLogs(): Observable<ICorporateContactLogModel[]> {
        return from( CorporateContactLog.find({}) );
    }

    /**
     * Find all corporate contact logs associated to a Corporate Contact with _id <docId>, created at or after <date>,
     * sorted by descending datetime (most recent first)
     */
    getCorporateContactLogsByIdAfterDate(docId: string, date: Date): Observable<ICorporateContactLogModel[]> {
        const inputDate = new Date(date.toISOString());
        return from( CorporateContactLog.find({
            documentId: docId,
            datetime: { $gte: inputDate }
        })).pipe(
            map((logs: ICorporateContactLogModel[]) => {
                return logs.sort((a, b) => (b.datetime as any) - (a.datetime as any));
            })
        );
    }

    getCorporateContactLogById(logId: string): Observable<ICorporateContactLogModel> {
        return from( CorporateContactLog.findById(logId) );
    }

    addCorporateContactLog(logData: IOperationLog): Observable<ICorporateContactLogModel> {
        return from( CorporateContactLog.create(logData) );
    }

    findDocumentByEntity(docId: string, entity: LogResourceName): Observable<IAnyEntityModel | null> {
        switch (entity) {
            case LogResourceName.USER:
                return UserDal.getUserById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.USER_GROUP:
                return UserGroupDal.getUserGroupById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.ROLE:
                return RoleDal.getRoleById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.PHYSICAL_CONTACT:
                return PhysicalContactDal.getContactById(docId) as Observable<IAnyEntityModel>;

            case LogResourceName.CORPORATE_CONTACT:
                return CorporateContactDal.getContactById(docId) as Observable<IAnyEntityModel>;
        }
        return of(null);
    }

}

export const operationLogDalSingleton = new OperationLogDal();
