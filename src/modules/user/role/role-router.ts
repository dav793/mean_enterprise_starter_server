import { Router } from 'express';

import { RoleExpressLayerSingleton as roleExpress } from './role-express';
import { authorize } from '../permission/permission-express';
import { ResourceName } from '../../../shared/enums/resources';
import { PermissionAction, PermissionLevel } from '../permission/permission-enums';

export class RoleRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/',
            authorize(ResourceName.ROLE, PermissionAction.READ, PermissionLevel.ALLOW),
            roleExpress.getAllRoles
        );

        this.router.get('/:id', 
            authorize(ResourceName.ROLE, PermissionAction.READ, PermissionLevel.ALLOW),
            roleExpress.getRoleById
        );

        this.router.post('/', 
            authorize(ResourceName.ROLE, PermissionAction.CREATE, PermissionLevel.ALLOW),
            roleExpress.createRole
        );

        this.router.put('/:id', 
            authorize(ResourceName.ROLE, PermissionAction.UPDATE, PermissionLevel.ALLOW),
            roleExpress.updateRole
        );

        this.router.delete('/:id',
            authorize(ResourceName.ROLE, PermissionAction.DELETE, PermissionLevel.ALLOW),
            roleExpress.deleteRole
        );

    }

}

export default new RoleRouter().router;
