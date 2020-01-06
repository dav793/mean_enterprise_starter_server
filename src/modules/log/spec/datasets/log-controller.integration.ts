import {LogOperation, LogResourceName} from "../../log-enums";

module.exports = {

    usergrouplogs: [],

    rolelogs: [],

    userlogs: [
        {
            "_id" : "010000000000000000000000",
            "datetime" : new Date(2019, 10, 21, 17, 18, 41),
            "entity" : "user",
            "documentId" : "000000000000000000000000",
            "operation" : "create",
            "changes" : {
                "_id" : "000000000000000000000000",
                "firstName" : "Fname1",
                "lastName" : "Lname1",
                "secondLastName" : "",
                "email" : "test@test.com",
                "roleIds" : [
                    "100000000000000000000000"
                ],
                "updatePassword" : false,
                "deleted" : false,
                "username" : "test1",
                "salt" : "f2806823faa4f1aeea992cdaa04090b5",
                "hash" : "0b19be135c1aeab6f000395298b032a3b798e2d892970107f496285aec1e9d3f96015b4c4e0c9e318c1d4e195b154a2adbf7381d17f90571d864b153f483a2a0",
                "createdAt" : new Date(2019, 11, 21, 17, 18, 41),
                "updatedAt" : new Date(2019, 11, 21, 17, 18, 41),
                "__v" : 0
            },
            "__v" : 0
        },
        {
            "_id" : "010000000000000000000001",
            "datetime" : new Date(2019, 10, 21, 19, 20, 7),
            "entity" : "user",
            "documentId" : "000000000000000000000000",
            "operation" : "update",
            "changes" : {
                "firstName" : "Fname2",
                "roleIds" : [
                    "100000000000000000000001",
                    "100000000000000000000000"
                ],
                "__v" : 1
            },
            "__v" : 0
        },
        {
            "_id" : "010000000000000000000002",
            "datetime" : new Date(2019, 10, 21, 21, 13),
            "entity" : "user",
            "documentId" : "000000000000000000000000",
            "operation" : "update",
            "changes" : {
                "roleIds" : [
                    "100000000000000000000001"
                ],
                "__v" : 2
            },
            "__v" : 0
        }
    ],

    users: [
        {
            "_id" : "000000000000000000000000",
            "firstName" : "Fname2",
            "lastName" : "Lname1",
            "secondLastName" : "",
            "email" : "test@test.com",
            "roleIds" : [
                "100000000000000000000001"
            ],
            "updatePassword" : false,
            "deleted" : false,
            "username" : "test1",
            "salt" : "f2806823faa4f1aeea992cdaa04090b5",
            "hash" : "0b19be135c1aeab6f000395298b032a3b798e2d892970107f496285aec1e9d3f96015b4c4e0c9e318c1d4e195b154a2adbf7381d17f90571d864b153f483a2a0",
            "createdAt" : new Date(2019, 10, 21, 17, 18, 41),
            "updatedAt" : new Date(2019, 10, 21, 17, 18, 41),
            "__v" : 2
        }
    ],

    roles: [],

    usergroups: []

};
