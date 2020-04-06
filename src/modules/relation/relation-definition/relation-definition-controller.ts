import {Observable, of} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import SocketIOServer from '../../../shared/lib/socket.io/socket';
import {IUpdateEntityPayload, SocketMessageType} from '../../../shared/lib/socket.io/socket-types';

import {IReqMetadata} from '../../../shared/helpers/request-metadata-factory';

import {logControllerSingleton as LogController} from '../../log/log-controller';
import {LogOperation, LogResourceName} from '../../log/log-enums';

import {globalVariableControllerSingleton as GlobalVariableController} from '../../global-variable/global-variable-controller';

import {relationDefinitionDalSingleton as RelationDefinitionDal} from './relation-definition-dal';
import {IRelationDefinitionModel} from './relation-definition-model';

import {updateOne} from '../../../shared/helpers/operators/update-one';
import {createOne} from '../../../shared/helpers/operators/create-one';
import {deleteOne} from '../../../shared/helpers/operators/delete-one';

const logger = require('../../../shared/lib/winston');

class RelationDefinitionController {

    constructor() { }

    getRelationDefinitions(): Observable<IRelationDefinitionModel[]> {
        return RelationDefinitionDal.getRelationDefinitions();
    }

    getRelationDefinitionById(relationDefinitionId: string): Observable<IRelationDefinitionModel|null> {
        return RelationDefinitionDal.getRelationDefinitionById(relationDefinitionId);
    }

    revertRelationDefinition(relationDefinitionId: string, relationDefinitionData: any, meta: IReqMetadata = {}): Observable<IRelationDefinitionModel> {
        return updateOne({
            updateSingleAction: () => RelationDefinitionDal.updateRelationDefinition(relationDefinitionId, relationDefinitionData),
            fetchSingleAction: () => this.getRelationDefinitionById(relationDefinitionId),
            logging: {
                resourceName: LogResourceName.RELATION_DEFINITION,
                operation: LogOperation.REVERT
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_DEFINITIONS
            }
        }, meta);
    }

    updateRelationDefinition(relationDefinitionId: string, relationDefinitionData: any, meta: IReqMetadata = {}): Observable<IRelationDefinitionModel> {
        return updateOne({
            updateSingleAction: () => RelationDefinitionDal.updateRelationDefinition(relationDefinitionId, relationDefinitionData),
            fetchSingleAction: () => this.getRelationDefinitionById(relationDefinitionId),
            logging: {
                resourceName: LogResourceName.RELATION_DEFINITION,
                operation: LogOperation.UPDATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_DEFINITIONS
            }
        }, meta);
    }

    createRelationDefinition(relationDefinitionData: any, meta: IReqMetadata = {}): Observable<IRelationDefinitionModel> {
        (relationDefinitionData as any).balance = relationDefinitionData.startingBalance;

        return createOne({
            createSingleAction: officialId => {
                if (officialId)
                    (relationDefinitionData as any).officialId = officialId;
                return RelationDefinitionDal.createRelationDefinition(relationDefinitionData);
            },
            logging: {
                resourceName: LogResourceName.RELATION_DEFINITION,
                operation: LogOperation.CREATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_DEFINITIONS
            }
        }, meta);
    }

    deleteRelationDefinition(relationDefinitionId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return deleteOne({
            deleteSingleAction: () => RelationDefinitionDal.deleteRelationDefinition(relationDefinitionId),
            fetchSingleAction: () => this.getRelationDefinitionById(relationDefinitionId),
            logging: {
                resourceName: LogResourceName.RELATION_DEFINITION,
                operation: LogOperation.DELETE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_DEFINITIONS
            }
        }, meta);
    }

}

export const relationDefinitionControllerSingleton = new RelationDefinitionController();
