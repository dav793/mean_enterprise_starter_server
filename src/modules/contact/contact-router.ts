import { Router } from 'express';

import { ResourceName } from '../../shared/enums/resources';
// import { PermissionAction, PermissionLevel } from '../permission/permission-enums';
// import { authorize } from '../permission/permission-express';
import { contactExpressLayerSingleton as contactExpress } from './contact-express';

class ContactRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        
        // Revisar/////////////////////////////////////////////////////////////////////////////////////////////////////
        // this.router.get('/',
        //     authorize(ResourceName.USER, PermissionAction.READ, PermissionLevel.ALLOW),
        //     contactExpress.getAllContacts
        // );

        // this.router.get('/:id',
        //     authorize(ResourceName.USER, PermissionAction.READ, PermissionLevel.ALLOW),
        //     contactExpress.getContactById
        // );

        // this.router.put('/:id',
        //     authorize(ResourceName.USER, PermissionAction.UPDATE, PermissionLevel.ALLOW),
        //     contactExpress.updateContact
        // );

        // this.router.post('/',
        //     authorize(ResourceName.USER, PermissionAction.CREATE, PermissionLevel.ALLOW),
        //     contactExpress.createContact
        // );

        // this.router.delete('/:id',
        //     authorize(ResourceName.USER, PermissionAction.DELETE, PermissionLevel.ALLOW),
        //     contactExpress.deleteContact
        // );

    }
}

export default new ContactRouter().router;
