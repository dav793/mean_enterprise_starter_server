import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GlobalVariable, IGlobalVariableModel } from './global-variable-model';
import { ErrorName } from '../../shared/enums/errors';

class GlobalVariableDal {

    constructor() { }

    getGlobalVariables(): Observable<IGlobalVariableModel[]> {
        return from( GlobalVariable.find( {deleted: { $ne: true }} ) );
    }

    getGlobalVariableById(id: string): Observable<IGlobalVariableModel|null> {
        return from( GlobalVariable.findById(id) );
    }

    getGlobalVariableByName(name: string): Observable<IGlobalVariableModel|null> {
        return from( GlobalVariable.findOne({ name }) );
    }

    createGlobalVariable(globalVariableData: any): Observable<IGlobalVariableModel> {
        return from( GlobalVariable.create(globalVariableData) );
    }

    updateGlobalVariable(id: string, globalVariableData: any): Observable<IGlobalVariableModel> {
        return this.getGlobalVariableById(id).pipe(
            switchMap(globalVariable => {
                if (globalVariable) {
                    return from( GlobalVariable.findByIdAndUpdate(id, globalVariableData, {new: true}) );
                }
                else {
                    const err = new Error(`global variable with id ${id} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })
        );
    }

    deleteGlobalVariable(id: string): Observable<IGlobalVariableModel> {
        return this.updateGlobalVariable(id, { deleted: true } as any);
    }

}

export const globalVariableDalSingleton = new GlobalVariableDal();
