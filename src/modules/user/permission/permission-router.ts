
import { Router, Request, Response, NextFunction } from 'express';
import { ResourceName } from '../../../shared/enums/resources';
import { permissionExpressLayerSingleton as permissionExpress } from './permission-express';
import { PermissionAction, PermissionLevel } from './permission-enums';

export class PermissionRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/:userId', 
            permissionExpress.authorize(ResourceName.PERMISSION, PermissionAction.READ, PermissionLevel.ALLOW),
            permissionExpress.getPermissionByUserId
        );

        this.router.get('/:userId/:resource', 
            permissionExpress.authorize(ResourceName.PERMISSION, PermissionAction.READ, PermissionLevel.ALLOW),
            permissionExpress.getPermissionOverResourceByUserId
        );

        this.router.get('/:userId/:resource/:action', 
            permissionExpress.authorize(ResourceName.PERMISSION, PermissionAction.READ, PermissionLevel.ALLOW),
            permissionExpress.getPermissionToActionOverResourceByUserId
        );
    }
}

export default new PermissionRouter().router;
