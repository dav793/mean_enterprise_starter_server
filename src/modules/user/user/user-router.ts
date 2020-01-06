import { Router } from 'express';

import { ResourceName } from '../../../shared/enums/resources';
import { PermissionAction, PermissionLevel } from '../permission/permission-enums';
import { authorize } from '../permission/permission-express';
import { userExpressLayerSingleton as userExpress } from './user-express';

class UserRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/',
            authorize(ResourceName.USER, PermissionAction.READ, PermissionLevel.ALLOW),
            userExpress.getAllUsers
        );

        this.router.get('/:id',
            authorize(ResourceName.USER, PermissionAction.READ, PermissionLevel.ALLOW),
            userExpress.getUserById
        );

        this.router.put('/:id',
            authorize(ResourceName.USER, PermissionAction.UPDATE, PermissionLevel.ALLOW),
            userExpress.updateUser
        );

        this.router.post('/',
            authorize(ResourceName.USER, PermissionAction.CREATE, PermissionLevel.ALLOW),
            userExpress.createUser
        );

        this.router.delete('/:id',
            authorize(ResourceName.USER, PermissionAction.DELETE, PermissionLevel.ALLOW),
            userExpress.deleteUser
        );

    }
}

export default new UserRouter().router;
