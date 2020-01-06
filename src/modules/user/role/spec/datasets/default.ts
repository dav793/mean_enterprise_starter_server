
import { PermissionAction } from '../../../permission/permission-enums';
import { PermissionLevel } from '../../../permission/permission-enums';

module.exports = {

    roles: [
        {
            _id : '000000000000000000000000',
            name : 'Role A',
            resources : [{
                name: 'Resource A',
                permissions: [{
                    action: PermissionAction.CREATE,
                    level: PermissionLevel.ALLOW
                }, {
                    action: PermissionAction.READ,
                    level: PermissionLevel.DENY
                }, {
                    action: PermissionAction.UPDATE,
                    level: PermissionLevel.ALLOW
                }, {
                    action: PermissionAction.DELETE,
                    level: PermissionLevel.DENY
                }]
            }]
        }
    ]

};
