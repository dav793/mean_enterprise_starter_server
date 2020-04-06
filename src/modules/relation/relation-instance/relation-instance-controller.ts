import {Observable, of} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import SocketIOServer from '../../../shared/lib/socket.io/socket';
import {IUpdateEntityPayload, SocketMessageType} from '../../../shared/lib/socket.io/socket-types';

import {IReqMetadata} from '../../../shared/helpers/request-metadata-factory';

import {logControllerSingleton as LogController} from '../../log/log-controller';
import {LogOperation, LogResourceName} from '../../log/log-enums';

import {globalVariableControllerSingleton as GlobalVariableController} from '../../global-variable/global-variable-controller';

import {relationInstanceDalSingleton as RelationInstanceDal} from './relation-instance-dal';
import {IRelationInstanceModel} from './relation-instance-model';

import {updateOne} from '../../../shared/helpers/operators/update-one';
import {createOne} from '../../../shared/helpers/operators/create-one';
import {deleteOne} from '../../../shared/helpers/operators/delete-one';

const logger = require('../../../shared/lib/winston');

class RelationInstanceController {

    constructor() { }

    getRelationInstances(): Observable<IRelationInstanceModel[]> {
        return RelationInstanceDal.getRelationInstances();
    }

    getRelationInstanceById(relationInstanceId: string): Observable<IRelationInstanceModel|null> {
        return RelationInstanceDal.getRelationInstanceById(relationInstanceId);
    }

    revertRelationInstance(relationInstanceId: string, relationInstanceData: any, meta: IReqMetadata = {}): Observable<IRelationInstanceModel> {
        return updateOne({
            updateSingleAction: () => RelationInstanceDal.updateRelationInstance(relationInstanceId, relationInstanceData),
            fetchSingleAction: () => this.getRelationInstanceById(relationInstanceId),
            logging: {
                resourceName: LogResourceName.RELATION_INSTANCE,
                operation: LogOperation.REVERT
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_INSTANCES
            }
        }, meta);
    }

    updateRelationInstance(relationInstanceId: string, relationInstanceData: any, meta: IReqMetadata = {}): Observable<IRelationInstanceModel> {
        return updateOne({
            updateSingleAction: () => RelationInstanceDal.updateRelationInstance(relationInstanceId, relationInstanceData),
            fetchSingleAction: () => this.getRelationInstanceById(relationInstanceId),
            logging: {
                resourceName: LogResourceName.RELATION_INSTANCE,
                operation: LogOperation.UPDATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_INSTANCES
            }
        }, meta);
    }

    createRelationInstance(relationInstanceData: any, meta: IReqMetadata = {}): Observable<IRelationInstanceModel> {
        (relationInstanceData as any).balance = relationInstanceData.startingBalance;

        return createOne({
            createSingleAction: officialId => {
                if (officialId)
                    (relationInstanceData as any).officialId = officialId;
                return RelationInstanceDal.createRelationInstance(relationInstanceData);
            },
            logging: {
                resourceName: LogResourceName.RELATION_INSTANCE,
                operation: LogOperation.CREATE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_INSTANCES
            }
        }, meta);
    }

    deleteRelationInstance(relationInstanceId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return deleteOne({
            deleteSingleAction: () => RelationInstanceDal.deleteRelationInstance(relationInstanceId),
            fetchSingleAction: () => this.getRelationInstanceById(relationInstanceId),
            logging: {
                resourceName: LogResourceName.RELATION_INSTANCE,
                operation: LogOperation.DELETE
            },
            socket: {
                messageType: SocketMessageType.UPDATE_RELATION_INSTANCES
            }
        }, meta);
    }

}

export const relationInstanceControllerSingleton = new RelationInstanceController();
