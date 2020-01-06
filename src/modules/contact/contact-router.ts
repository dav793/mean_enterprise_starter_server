import { Router } from 'express';

import { ContactExpressLayerSingleton as contactExpress } from './contact-express';
import { authorize } from '../user/permission/permission-express';
import { PermissionAction, PermissionLevel } from '../user/permission/permission-enums';
import { ResourceName } from '../../shared/enums/resources';

export class ContactRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/',
            authorize(ResourceName.CONTACT, PermissionAction.READ, PermissionLevel.ALLOW),
            contactExpress.getAllContacts
        );

        this.router.get('/:id',
            authorize(ResourceName.CONTACT, PermissionAction.READ, PermissionLevel.ALLOW),
            contactExpress.getContactById
        );

        this.router.post('/',
            authorize(ResourceName.CONTACT, PermissionAction.CREATE, PermissionLevel.ALLOW),
            contactExpress.createContact
        );

        this.router.put('/:id',
            authorize(ResourceName.CONTACT, PermissionAction.UPDATE, PermissionLevel.ALLOW),
            contactExpress.updateContact
        );

        this.router.delete('/:id',
            authorize(ResourceName.CONTACT, PermissionAction.DELETE, PermissionLevel.ALLOW),
            contactExpress.deleteContact
        );

    }

}

export default new ContactRouter().router;
