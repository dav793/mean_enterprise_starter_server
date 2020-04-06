
import {Observable, of, throwError} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import { LogOperation, LogResourceName } from '../../../modules/log/log-enums';
import { IReqMetadata } from '../request-metadata-factory';
import { IUpdateEntityPayload, SocketMessageType } from '../../lib/socket.io/socket-types';

import { logControllerSingleton as LogController } from '../../../modules/log/log-controller';

import SocketIOServer from '../../lib/socket.io/socket';


export interface IDeleteOneParams {
    deleteSingleAction: () => Observable<any>;
    fetchSingleAction: () => Observable<any>;
    logging?: {
        resourceName: LogResourceName;
        operation: LogOperation;
    };
    socket?: {
        messageType: SocketMessageType;
    };
}

export function deleteOne(params: IDeleteOneParams, requestMeta: IReqMetadata): Observable<boolean> {

    return params.fetchSingleAction().pipe(
        concatMap((oldInstance: any) => {

            return params.deleteSingleAction().pipe(
                concatMap((instance: any) => {

                    if (params.logging)
                        return LogController.logOperation(params.logging.resourceName, params.logging.operation, oldInstance.toObject(), instance.toObject(), requestMeta)
                            .pipe( map(() => instance) );
                    else
                        return of(instance);

                }),
                concatMap((instance: any) => {

                    if (params.socket) {
                        const data: IUpdateEntityPayload = {
                            originatorId: requestMeta.clientId
                        };
                        SocketIOServer.broadcast(params.socket.messageType, data);
                    }

                    return of(instance);

                }),
                map(() => true)
            );

        })
    );

}
