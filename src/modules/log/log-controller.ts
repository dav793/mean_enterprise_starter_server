import {forkJoin, Observable, of, throwError} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {ErrorName} from '../../shared/enums/errors';
import {IReqMetadata} from '../../shared/helpers/request-metadata-factory';
import {areArraysEqualSets} from '../../shared/helpers/array-utils';
import {LogOperation, LogResourceName} from './log-enums';
import {operationLogDalSingleton as OperationLogDal} from './log-dal';
import {IOperationLog} from './log-interface';
import {IAnyEntityModel, IAnyLogModel} from './log-model';

import {userControllerSingleton as UserController} from '../user/user/user-controller';
import {userGroupControllerSingleton as UserGroupController} from '../user/user-group/user-group-controller';
import {roleControllerSingleton as RoleController} from '../user/role/role-controller';
import {contactControllerSingleton as ContactController} from '../contact/contact-controller';

import Utils from '../../shared/helpers/utils';

import * as _ from 'lodash';

class LogController {

    constructor() {}

    logOperation(resource: LogResourceName, operation: LogOperation, original: any, modified: any, meta: IReqMetadata = {}): Observable<void> {

        let action;
        switch (resource) {
            case LogResourceName.USER:
                action = OperationLogDal.addUserLog;
                break;
            case LogResourceName.USER_GROUP:
                action = OperationLogDal.addUserGroupLog;
                break;
            case LogResourceName.ROLE:
                action = OperationLogDal.addRoleLog;
                break;
            case LogResourceName.PHYSICAL_CONTACT:
                action = OperationLogDal.addPhysicalContactLog;
            case LogResourceName.CORPORATE_CONTACT:
                action = OperationLogDal.addCorporateContactLog;
        }

        if (action) {
            const changes = this.extractDifferences(original, modified);
            let logData: IOperationLog = {
                datetime: new Date(),
                userId: meta.userId,
                entity: resource,
                documentId: modified._id.toString(),
                operation: operation,
                changes
            };
            return action(logData).pipe(
                map(r => null)
            );
        }

        return of(null);
    }

    revertDocumentState(targetLogEntry: IAnyLogModel, meta: IReqMetadata = {}): Observable<any> {

        let logsFetcher;
        switch (targetLogEntry.entity) {
            case LogResourceName.USER:
                logsFetcher = OperationLogDal.getUserLogsByIdAfterDate(targetLogEntry.documentId, targetLogEntry.datetime);
                break;
            case LogResourceName.USER_GROUP:
                logsFetcher = OperationLogDal.getUserGroupLogsByIdAfterDate(targetLogEntry.documentId, targetLogEntry.datetime);
                break;
            case LogResourceName.ROLE:
                logsFetcher = OperationLogDal.getRoleLogsByIdAfterDate(targetLogEntry.documentId, targetLogEntry.datetime);
                break;
            case LogResourceName.PHYSICAL_CONTACT:
                logsFetcher = OperationLogDal.getPhysicalContactLogsByIdAfterDate(targetLogEntry.documentId, targetLogEntry.datetime);
                break;
            case LogResourceName.CORPORATE_CONTACT:
                logsFetcher = OperationLogDal.getCorporateContactLogsByIdAfterDate(targetLogEntry.documentId, targetLogEntry.datetime);
                break;
            default:
                const err = new Error(`unrecognized entity: ${targetLogEntry.entity}`);
                err.name = ErrorName.UNRECOGNIZED_ENTITY;
                return throwError(err);
        }

        return forkJoin([
            OperationLogDal.findDocumentByEntity(targetLogEntry.documentId, targetLogEntry.entity),
            logsFetcher
        ]).pipe(
            switchMap(([doc, logs]) => {

                const newDoc = _.cloneDeep((doc as IAnyEntityModel).toObject());
                (logs as IAnyLogModel[]).forEach(
                    (log: IAnyLogModel) => Object.assign(newDoc, log.changes)
                );

                let saveAction;
                switch(targetLogEntry.entity) {
                    case LogResourceName.USER:
                        saveAction = UserController.revertUser(targetLogEntry.documentId, newDoc as any, meta);
                        break;
                    case LogResourceName.USER_GROUP:
                        saveAction = UserGroupController.revertUserGroup(targetLogEntry.documentId, newDoc as any, meta);
                        break;
                    case LogResourceName.ROLE:
                        saveAction = RoleController.revertRole(targetLogEntry.documentId, newDoc as any, meta);
                        break;
                    case LogResourceName.PHYSICAL_CONTACT:
                    case LogResourceName.CORPORATE_CONTACT:
                        saveAction = ContactController.revertContact(targetLogEntry.documentId, newDoc as any, meta);
                        break;
                    default:
                        const err = new Error(`unrecognized entity: ${targetLogEntry.entity}`);
                        err.name = ErrorName.UNRECOGNIZED_ENTITY;
                        return throwError(err);
                }

                return saveAction;

            })
        );
    }

    /**
     * Return an object with the values of all properties which are different between the two provided objects <original> and <modified>.
     * this returned object effectively contains all the differences between <original> and <modified>.
     *
     * The intent of this method is to allow for detailed logging of any operation which modifies a DB entity, in such a way that
     * it later allows reconstruction of any past state of such entity.
     *
     * The properties of the provided objects may be primitives, single/multi-level arrays, single/multi-level objects,
     * or any combination of both.
     *
     * Whenever multi-level properties (objects or arrays) are encountered, the difference-detection algorithm will dive as many
     * as <maxLevels> levels down such structures (default = 5). Any differences beyond this number of levels will not be detected.
     *
     * PLEASE NOTE the following conditions for <original> and <modified>:
     *  - <original> may be an empty object ({}), however <modified> may not.
     *  - if <original> is NOT an empty object, <original> and <modified> MUST contain the same properties,
     *    otherwise an INCOMPATIBLE_OBJ_STRUCT error is thrown. However, the values of the properties may be different.
     *
     * @param original The original object.
     * @param modified The object to compare <original> against.
     * @param maxLevels The maximum number of levels that the difference-scanning algorith is allowed to descend down multi-level property values (objects or arrays).
     * @return object An object containing the differences between <original> and <modified>.
     */
    extractDifferences(original: {[key: string]: any}, modified: {[key: string]: any}, maxLevels = 5): {[key: string]: any} {

        let diff = {};

        if ( Utils.isEmptyObj(original) ) {
            return _.cloneDeep(modified);
        }
        else if ( !areArraysEqualSets(Object.keys(original), Object.keys(modified)) ) {
            const err = new Error(`compared objects have incompatible properties`);
            err.name = ErrorName.INCOMPATIBLE_OBJ_STRUCT;
            throw err;
            return;
        }

        Object.keys(modified).forEach(key => {

            if ( Utils.isNonNullObject(modified[key]) ) {     // is object

                if (maxLevels > 0) {
                    const propDiffs = this.extractDifferences(original[key], modified[key], maxLevels-1);
                    if ( !Utils.isEmptyObj(propDiffs) )
                        diff[key] = _.cloneDeep(modified[key]);
                }

            }
            else if ( Utils.isArray(modified[key]) ) {        // is array

                const arraysAreDifferent = this.valuesAreDifferent(original[key], modified[key]);
                if (arraysAreDifferent)
                    diff[key] = _.cloneDeep(modified[key]);

            }
            else {                                            // is anything else

                if (original[key] !== modified[key])
                    diff[key] = modified[key];

            }

        });

        return _.cloneDeep(diff);
    }

    /**
     * Detects whether or not the values of <original> and <modified> are different.
     *
     * <original> and <modified> may be primitives, single/multi-level arrays or single/multi-level objects.
     *
     * Whenever multi-level properties (objects or arrays) are encountered, the difference-detection algorithm will dive as many
     * as <maxLevels> levels down such structures (default = 5). Any differences beyond this number of levels will not be detected.
     *
     * @param original The original value.
     * @param modified The value to compare <original> against.
     * @param maxLevels The maximum number of levels that the difference-scanning algorith is allowed to descend down multi-level property values (objects or arrays).
     * @return boolean Whether or not <original> and <modified> are detected to be different.
     */
    valuesAreDifferent(original: any, modified: any, maxLevels = 5): boolean {

        if ( Utils.isNonNullObject(original) && Utils.isNonNullObject(modified) ) {     // is object

            if (maxLevels <= 0)
                return false;

            const diff = this.extractDifferences(original, modified, maxLevels-1);
            if ( Utils.isEmptyObj(diff) )
                return false;
            else
                return true;

        }
        else if ( Utils.isArray(original) && Utils.isArray(modified) ) {                // is array

            if (maxLevels <= 0)
                return false;

            if (original.length === modified.length) {

                let isDifferent = false;
                modified.forEach((val, idx) => {
                    if ( this.valuesAreDifferent(original[idx], val, maxLevels-1) )
                        isDifferent = true;
                });
                return isDifferent;

            }
            else
                return true;

        }
        else {                                            // is anything else
            if (original === modified)
                return false;
            else
                return true;
        }

    }

}

export const logControllerSingleton = new LogController();
