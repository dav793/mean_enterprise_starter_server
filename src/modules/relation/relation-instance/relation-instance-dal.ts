import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RelationInstance, IRelationInstanceModel } from './relation-instance-model';
import { ErrorName } from '../../../shared/enums/errors';

class RelationInstanceDal {

    constructor() {}

    getRelationInstances(): Observable<IRelationInstanceModel[]> {
        return from( RelationInstance.find( {deleted: { $ne: true }} ) );
    }

    getRelationInstanceById(relationInstanceId: string): Observable<IRelationInstanceModel|null> {
        return from( RelationInstance.findById(relationInstanceId) );
    }

    createRelationInstance(relationInstanceData: any): Observable<IRelationInstanceModel> {
        return from( RelationInstance.create(relationInstanceData) );
    }

    updateRelationInstance(relationInstanceId: string, relationInstanceData: any): Observable<IRelationInstanceModel> {
        return this.getRelationInstanceById(relationInstanceId).pipe(
            switchMap(relationInstance => {
                if (relationInstance) {
                    return from( RelationInstance.findByIdAndUpdate(relationInstanceId, relationInstanceData, {new: true}) );
                }
                else {
                    const err = new Error(`relation instance with id ${relationInstanceId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })
        );
    }

    deleteRelationInstance(relationInstanceId: string): Observable<IRelationInstanceModel> {
        return this.updateRelationInstance(relationInstanceId, { deleted: true } as any);
    }

}

export const relationInstanceDalSingleton = new RelationInstanceDal();
