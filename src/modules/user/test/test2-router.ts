import {NextFunction, Request, Response, Router} from 'express';

import { ResourceName } from '../../../shared/enums/resources';
import { PermissionAction, PermissionLevel } from '../permission/permission-enums';
import { authorize } from '../permission/permission-express';

class Test2Router {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/',
            authorize(ResourceName.USER, PermissionAction.READ, PermissionLevel.ALLOW),
            (req: Request, res: Response, next: NextFunction) => {

                console.log('hit request');
                res.status(200).json({success: true});

            }
        );

    }
}

export default new Test2Router().router;
