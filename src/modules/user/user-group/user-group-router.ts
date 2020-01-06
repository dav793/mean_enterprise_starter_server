import { Router } from 'express';
import { ResourceName } from '../../../shared/enums/resources';
import { PermissionAction, PermissionLevel } from '../permission/permission-enums';
import { authorize } from '../permission/permission-express';
import { userGroupExpressLayerSingleton as userGroupExpressLayer } from './user-group-express';

export class UserGroupRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/',
            authorize(ResourceName.USER_GROUP, PermissionAction.READ, PermissionLevel.ALLOW),
            userGroupExpressLayer.getAllUserGroups
        );
        
        this.router.get('/:id',
            authorize(ResourceName.USER_GROUP, PermissionAction.READ, PermissionLevel.ALLOW),
            userGroupExpressLayer.getUserGroup
        );

        this.router.post('/',
            authorize(ResourceName.USER_GROUP, PermissionAction.CREATE, PermissionLevel.ALLOW),
            userGroupExpressLayer.createUserGroup
        );

        this.router.put('/:id',
            authorize(ResourceName.USER_GROUP, PermissionAction.UPDATE, PermissionLevel.ALLOW),
            userGroupExpressLayer.updateUserGroup
        );

        this.router.delete('/:id',
            authorize(ResourceName.USER_GROUP, PermissionAction.DELETE, PermissionLevel.ALLOW),
            userGroupExpressLayer.deleteUserGroup
        );

    }
}

export default new UserGroupRouter().router;
