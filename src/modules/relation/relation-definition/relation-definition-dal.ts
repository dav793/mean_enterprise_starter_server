import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RelationDefinition, IRelationDefinitionModel } from './relation-definition-model';
import { ErrorName } from '../../../shared/enums/errors';

class RelationDefinitionDal {

    constructor() {}

    getRelationDefinitions(): Observable<IRelationDefinitionModel[]> {
        return from( RelationDefinition.find( {deleted: { $ne: true }} ) );
    }

    getRelationDefinitionById(relationDefinitionId: string): Observable<IRelationDefinitionModel|null> {
        return from( RelationDefinition.findById(relationDefinitionId) );
    }

    createRelationDefinition(relationDefinitionData: any): Observable<IRelationDefinitionModel> {
        return from( RelationDefinition.create(relationDefinitionData) );
    }

    updateRelationDefinition(relationDefinitionId: string, relationDefinitionData: any): Observable<IRelationDefinitionModel> {
        return this.getRelationDefinitionById(relationDefinitionId).pipe(
            switchMap(relationDefinition => {
                if (relationDefinition) {
                    return from( RelationDefinition.findByIdAndUpdate(relationDefinitionId, relationDefinitionData, {new: true}) );
                }
                else {
                    const err = new Error(`relation definition with id ${relationDefinitionId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })
        );
    }

    deleteRelationDefinition(relationDefinitionId: string): Observable<IRelationDefinitionModel> {
        return this.updateRelationDefinition(relationDefinitionId, { deleted: true } as any);
    }

}

export const relationDefinitionDalSingleton = new RelationDefinitionDal();
