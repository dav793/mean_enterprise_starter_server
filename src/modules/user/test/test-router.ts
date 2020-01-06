import {NextFunction, Request, Response, Router} from 'express';

import { ResourceName } from '../../../shared/enums/resources';
import { PermissionAction, PermissionLevel } from '../permission/permission-enums';
import { authorize } from '../permission/permission-express';

class TestRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/',
            authorize(ResourceName.USER, PermissionAction.READ, PermissionLevel.REQUEST_AUTHENTICATION),
            (req: Request, res: Response, next: NextFunction) => {

                res.status(200).json({success: true});

            }
        );

    }
}

export default new TestRouter().router;
