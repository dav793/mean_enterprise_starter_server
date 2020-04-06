
import {Observable, of} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import { logControllerSingleton as LogController } from '../../../modules/log/log-controller';
import { LogOperation, LogResourceName } from '../../../modules/log/log-enums';
import { IUpdateEntityPayload, SocketMessageType } from '../../lib/socket.io/socket-types';
import SocketIOServer from '../../lib/socket.io/socket';
import { IReqMetadata } from '../request-metadata-factory';

export interface IUpdateOneParams {
    updateSingleAction: () => Observable<any>;
    fetchSingleAction: () => Observable<any>;
    logging?: {
        resourceName: LogResourceName;
        operation: LogOperation;
    };
    socket?: {
        messageType: SocketMessageType;
    };
}

export function updateOne(params: IUpdateOneParams, requestMeta: IReqMetadata): Observable<any> {
    return params.fetchSingleAction().pipe(
        concatMap((oldInstance: any) => {

            return params.updateSingleAction().pipe(
                concatMap((newInstance: any) => {

                    if (params.logging)
                        return LogController.logOperation(params.logging.resourceName, params.logging.operation, oldInstance.toObject(), newInstance.toObject(), requestMeta)
                            .pipe( map(() => newInstance) );
                    else
                        return of(newInstance);

                }),
                concatMap((newInstance: any) => {

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
