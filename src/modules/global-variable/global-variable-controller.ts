import {Observable, of, throwError} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import { IReqMetadata } from '../../shared/helpers/request-metadata-factory';
import { ErrorName } from '../../shared/enums/errors';

import { globalVariableDalSingleton as GlobalVariableDal } from './global-variable-dal';
import { IGlobalVariableModel } from './global-variable-model';
import { GlobalVariableName } from './global-variable-enums';
import { ILastEntityIdentifiers } from './global-variable-interface';

const logger = require('../../shared/lib/winston');

export class GlobalVariableControllerClass {

    constructor() { }

    getGlobalVariables(): Observable<IGlobalVariableModel[]> {
        return GlobalVariableDal.getGlobalVariables();
    }

    getGlobalVariableById(globalVariableId: string): Observable<IGlobalVariableModel|null> {
        return GlobalVariableDal.getGlobalVariableById(globalVariableId);
    }

    getGlobalVariableByName(globalVariableName: string): Observable<IGlobalVariableModel|null> {
        return GlobalVariableDal.getGlobalVariableByName(globalVariableName);
    }

    updateGlobalVariable(globalVariableId: string, globalVariableData: any, meta: IReqMetadata = {}): Observable<IGlobalVariableModel> {
        return GlobalVariableDal.updateGlobalVariable(globalVariableId, globalVariableData);
    }

    createGlobalVariable(globalVariableData: any, meta: IReqMetadata = {}): Observable<IGlobalVariableModel> {
        return GlobalVariableDal.createGlobalVariable(globalVariableData);
    }

    deleteGlobalVariable(globalVariableId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return GlobalVariableDal.deleteGlobalVariable(globalVariableId).pipe(
            map(() => true)
        );
    }

    getLastEntityIdentifiers(): Observable<ILastEntityIdentifiers> {
        return this.getGlobalVariableByName(GlobalVariableName.LAST_ENTITY_IDENTIFIERS).pipe(
            map(globalVariable => globalVariable.value as ILastEntityIdentifiers)
        );
    }

    getLastCaseIdentifier(): Observable<string|null> {
        return this.getLastEntityIdentifiers().pipe(
            map(lastEntityIdentifiers => lastEntityIdentifiers.case)
        );
    }

    updateLastCaseIdentifier(newValue: string): Observable<boolean> {
        return this.getGlobalVariableByName(GlobalVariableName.LAST_ENTITY_IDENTIFIERS).pipe(
            concatMap((lastEntityIdentifiers: IGlobalVariableModel) => {
                const modifications = {
                    value: {
                        case: newValue
                    }
                };

                return this.updateGlobalVariable(lastEntityIdentifiers._id.toString(), modifications);
            }),
            map(() => true)
        );
    }

}

export const globalVariableControllerSingleton = new GlobalVariableControllerClass();
