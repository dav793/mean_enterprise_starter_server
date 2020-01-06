
import { PermissionAction, PermissionLevel } from '../../../permission/permission-enums';

module.exports = {

    users: [
        {
            _id : '000000000000000000000000',
            firstName : 'Pedro',
            lastName : 'Villalba',
            email : 'test@email.com',
            roleIds: [
                '200000000000000000000000'
            ],
            updatePassword : false,
            deleted : false,
            username : 'admin'
        }
    ],

    userGroups: [
        {
            _id: '100000000000000000000000',
            userIds: [ '000000000000000000000000' ],
            roleIds: [ '200000000000000000000001' ],
            label: 'UserGroupA'
        }
    ],

    roles: [
        {
            _id: '200000000000000000000000',
            name: 'RoleA',
            resources: [
                {
                    name: 'ResourceA',
                    permissions: [
                        { action: PermissionAction.CREATE,   level: PermissionLevel.DENY },
                        { action: PermissionAction.READ,     level: PermissionLevel.DENY },
                        { action: PermissionAction.UPDATE,   level: PermissionLevel.ALLOW },
                        { action: PermissionAction.DELETE,   level: PermissionLevel.DENY }
                    ]
                }
            ]
        },
        {
            _id: '200000000000000000000001',
            name: 'RoleB',
            resources: [
                {
                    name: 'ResourceA',
                    permissions: [
                        { action: PermissionAction.CREATE,   level: PermissionLevel.DENY },
                        { action: PermissionAction.READ,     level: PermissionLevel.ALLOW },
                        { action: PermissionAction.UPDATE,   level: PermissionLevel.DENY },
                        { action: PermissionAction.DELETE,   level: PermissionLevel.DENY }
                    ]
                },
                {
                    name: 'ResourceB',
                    permissions: [
                        { action: PermissionAction.CREATE,   level: PermissionLevel.DENY },
                        { action: PermissionAction.READ,     level: PermissionLevel.DENY },
                        { action: PermissionAction.UPDATE,   level: PermissionLevel.DENY },
                        { action: PermissionAction.DELETE,   level: PermissionLevel.ALLOW }
                    ]
                }
            ]
        }
    ]

};
