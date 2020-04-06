
//  ==== USERS ====

// password is '12345678'
db.users.insert({
    "_id" : userId_admin,
    "firstName" : "Pedro",
    "lastName" : "Villalba",
    "email" : "test@email.com",
    "roleIds": [
        roleId_admin.valueOf()
    ],
    "updatePassword" : false,
    "deleted" : false,
    "username" : "admin",
    "salt" : "5f964426719302ee5b7899ed0e09c1ba",
    "hash" : "dea64a5418976b3306f945d665a3a3ef412d62ab7a3856cd9d713523e9879ca0ad626f771ff937fdeddc6347b55add27aaa8da9b9021f7ea6d0a15435b12c606",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

// password is '12345678'
db.users.insert({
    "_id" : userId_visitor,
    "firstName" : "Carlos",
    "lastName" : "Montero",
    "email" : "test@email.com",
    "roleIds": [
        roleId_visitor.valueOf(),
        roleId_writer.valueOf()
    ],
    "updatePassword" : false,
    "deleted" : false,
    "username" : "cmontero",
    "salt" : "5f964426719302ee5b7899ed0e09c1ba",
    "hash" : "dea64a5418976b3306f945d665a3a3ef412d62ab7a3856cd9d713523e9879ca0ad626f771ff937fdeddc6347b55add27aaa8da9b9021f7ea6d0a15435b12c606",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});


//  ==== USER GROUPS ====

db.usergroups.insert({
    "_id": userGroupId_admins,
    "userIds": [ userId_admin.valueOf() ],
    "roleIds": [ roleId_admin.valueOf() ],
    "label": "administrators",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.usergroups.insert({
    "_id": userGroupId_moderators,
    "userIds": [ userId_visitor.valueOf() ],
    "roleIds": [ roleId_moderator.valueOf() ],
    "label": "moderators",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});


//  ==== ROLES ====

db.roles.insert({
    "_id": roleId_admin,
    "name": "administrator",
    "resources": [
        {
            "name": "user",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        },
        {
            "name": "userGroup",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        },
        {
            "name": "role",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        },
        {
            "name": "permission",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        },
        {
            "name": "contact",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        },
        {
            "name": "relationDefinition",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        },
        {
            "name": "relationInstance",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.roles.insert({
    "_id": roleId_visitor,
    "name": "regular",
    "resources": [
        {
            "name": "user",
            "permissions": [
                { "action": "create",   "level": 1 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 1 },
                { "action": "delete",   "level": 1 }
            ]
        },
        {
            "name": "userGroup",
            "permissions": [
                { "action": "create",   "level": 1 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 1 },
                { "action": "delete",   "level": 1 }
            ]
        },
        {
            "name": "role",
            "permissions": [
                { "action": "create",   "level": 1 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 1 },
                { "action": "delete",   "level": 1 }
            ]
        },
        {
            "name": "permission",
            "permissions": [
                { "action": "create",   "level": 1 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 1 },
                { "action": "delete",   "level": 1 }
            ]
        },
        {
            "name": "contact",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 1 }
            ]
        },
        {
            "name": "relationDefinition",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 1 }
            ]
        },
        {
            "name": "relationInstance",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 1 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.roles.insert({
    "_id": roleId_moderator,
    "name": "moderator",
    "resources": [
        {
            "name": "user",
            "permissions": [
                { "action": "create",   "level": 1 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 1 },
                { "action": "delete",   "level": 3 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.roles.insert({
    "_id": roleId_writer,
    "name": "writer",
    "resources": [
        {
            "name": "user",
            "permissions": [
                { "action": "create",   "level": 1 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 1 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});
