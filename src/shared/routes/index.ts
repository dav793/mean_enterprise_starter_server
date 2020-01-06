import {Router} from 'express';
import {of} from 'rxjs';

import {LogResourceName} from '../../modules/log/log-enums';
import {operationLogDalSingleton as LogDal} from '../../modules/log/log-dal';
import {logControllerSingleton as LogController} from '../../modules/log/log-controller';
import {switchMap} from "rxjs/operators";

export class IndexRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/', (req, res) => {
            of(null).subscribe(() => {              // example usage of observable

                // SocketIOServer.broadcast(SocketMessageType.USERS_UPDATED);

                res.send('Hello World!');

            });
        });

        // @todo: remove this route in production
        this.router.put('/revertState/:entity/:logId', (req, res) => {

            const entity = req.params.entity;
            const logId = req.params.logId;

            let logFetcher;
            switch (entity) {
                case LogResourceName.USER:
                    logFetcher = LogDal.getUserLogById;
                    break;
                case LogResourceName.USER_GROUP:
                    logFetcher = LogDal.getUserGroupLogById;
                    break;
                case LogResourceName.ROLE:
                    logFetcher = LogDal.getRoleLogById;
                    break;
                default:
                    throw new Error('invalid entity');
            }

            logFetcher(logId).pipe(
                switchMap(logEntry => LogController.revertDocumentState(logEntry as any, {userId: ''}))
            ).subscribe(
                () => {
                    res.status(200).json({status: 'success'});
                },
                err => {
                    throw err;
                }
            );

        });
    }
}

export default new IndexRouter().router;
