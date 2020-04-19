import { Router } from 'express';

import { RelationExpressLayerSingleton as relationExpress } from './relation-express';
import { authorize } from '../user/permission/permission-express';
import { PermissionAction, PermissionLevel } from '../user/permission/permission-enums';
import { ResourceName } from '../../shared/enums/resources';

export class RelationRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/definitions',
            authorize(ResourceName.CONTACT, PermissionAction.READ, PermissionLevel.ALLOW),
            relationExpress.getAllRelationDefinitions
        );

        this.router.get('/instances',
            authorize(ResourceName.CONTACT, PermissionAction.READ, PermissionLevel.ALLOW),
            relationExpress.getAllRelationInstances
        );

        this.router.get('/definitions/:id',
            authorize(ResourceName.CONTACT, PermissionAction.READ, PermissionLevel.ALLOW),
            relationExpress.getRelationDefinitionById
        );

        this.router.get('/instances/:id',
            authorize(ResourceName.CONTACT, PermissionAction.READ, PermissionLevel.ALLOW),
            relationExpress.getRelationInstanceById
        );

        this.router.post('/definitions',
            authorize(ResourceName.CONTACT, PermissionAction.CREATE, PermissionLevel.ALLOW),
            relationExpress.createRelationDefinition
        );

        this.router.post('/instances',
            authorize(ResourceName.CONTACT, PermissionAction.CREATE, PermissionLevel.ALLOW),
            relationExpress.createRelationInstance
        );

        this.router.put('/definitions/:id',
            authorize(ResourceName.CONTACT, PermissionAction.UPDATE, PermissionLevel.ALLOW),
            relationExpress.updateRelationDefinition
        );

        this.router.put('/instances/:id',
            authorize(ResourceName.CONTACT, PermissionAction.UPDATE, PermissionLevel.ALLOW),
            relationExpress.updateRelationInstance
        );

        this.router.delete('/definitions/:id',
            authorize(ResourceName.CONTACT, PermissionAction.DELETE, PermissionLevel.ALLOW),
            relationExpress.deleteRelationDefinition
        );

        this.router.delete('/instances/:id',
            authorize(ResourceName.CONTACT, PermissionAction.DELETE, PermissionLevel.ALLOW),
            relationExpress.deleteRelationInstance
        );

    }

}

export default new RelationRouter().router;
