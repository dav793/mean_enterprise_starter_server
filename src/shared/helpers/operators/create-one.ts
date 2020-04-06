
import {Observable, of, throwError} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import { LogOperation, LogResourceName } from '../../../modules/log/log-enums';
import { ErrorName } from '../../enums/errors';
import { IReqMetadata } from '../request-metadata-factory';
import { IUpdateEntityPayload, SocketMessageType } from '../../lib/socket.io/socket-types';

import { logControllerSingleton as LogController } from '../../../modules/log/log-controller';
import { globalVariableControllerSingleton as GlobalVariableController, GlobalVariableControllerClass } from '../../../modules/global-variable/global-variable-controller';

import EntityIdentifierGenerator from '../../helpers/entity-identifier-generator';
import { EntityIdentifierGeneratorClass } from '../../helpers/entity-identifier-generator';
import SocketIOServer from '../../lib/socket.io/socket';


export interface ICreateOneParams {
    createSingleAction: (officialId: string) => Observable<any>;
    logging?: {
        resourceName: LogResourceName;
        operation: LogOperation;
    };
    socket?: {
        messageType: SocketMessageType;
    };
    officialIdGeneration?: {
        officialId: string,
        fetchAllAction: () => Observable<any[]>,
        globalVariableController: GlobalVariableControllerClass,
        entityIdentifierGenerator: EntityIdentifierGeneratorClass
    };
}

export function createOne(params: ICreateOneParams, requestMeta: IReqMetadata) {

    let idGenerationAction: Observable<null> = of(null);
    if (params.officialIdGeneration) {

        // if official ID is given by user, check that is unique
        if (params.officialIdGeneration.officialId) {

            idGenerationAction = params.officialIdGeneration.fetchAllAction().pipe(
                concatMap((instances: any[]) => {

                    const officialIds = instances.map(a => a.officialId);
                    if (officialIds.indexOf(params.officialIdGeneration.officialId) >= 0) {
                        const err = new Error(`Official ID ${params.officialIdGeneration.officialId} already exists`);
                        err.name = ErrorName.NON_UNIQUE_IDENTIFIER;
                        return throwError(err);
                    }
                    else
                        return of(null);

                })
            );

        }
        else {  // if no official ID is given, generate next id

            // @todo add any type of entity not just cases
            idGenerationAction = params.officialIdGeneration.globalVariableController.getLastCaseIdentifier().pipe(
                concatMap(lastId => {

                    const nextId = params.officialIdGeneration.entityIdentifierGenerator.generateNextCaseIdentifier(lastId);
                    params.officialIdGeneration.officialId = nextId;
                    return of(null);

                })
            );

        }

    }

    return idGenerationAction.pipe(
        concatMap(() => {

            // create the new instance
            const officialId = params.officialIdGeneration ? params.officialIdGeneration.officialId : null;
            return params.createSingleAction(officialId).pipe(
                concatMap((newInstance: any) => {

                    // do operation logging
                    if (params.logging)
                        return LogController.logOperation(params.logging.resourceName, params.logging.operation, {}, newInstance.toObject(), requestMeta)
                            .pipe( map(() => newInstance ));
                    else
                        return of(newInstance);

                }),
                concatMap((newInstance: any) => {

                    // do socket broadcasting
                    if (params.socket) {

                        const data: IUpdateEntityPayload = {
                            originatorId: requestMeta.clientId
                        };
                        SocketIOServer.broadcast(params.socket.messageType, data);

                    }

                    return of(newInstance);

                })
            );

        })
    );

}
