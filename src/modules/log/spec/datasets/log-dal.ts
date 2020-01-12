import {LogOperation, LogResourceName} from '../../log-enums';

/* tslint:disable */

module.exports = {

    userlogs: [
        {
            _id: '000000000000000000000000',
            datetime: new Date(2019, 7, 17, 11, 26, 38),
            userId: 'abc',
            entity: LogResourceName.USER,
            documentId: '456',
            operation: LogOperation.UPDATE,
            changes: {
                two: 'five'
            }
        },
        {
            _id: '000000000000000000000001',
            datetime: new Date(2019, 6, 3, 21, 10, 42),         // 3
            userId: 'abc',
            entity: LogResourceName.USER,
            documentId: '123',
            operation: LogOperation.UPDATE,
            changes: {
                two: 'three'
            }
        },
        {
            _id: '000000000000000000000002',
            datetime: new Date(2019, 8, 21, 5, 55, 3),          // 4
            userId: 'abc',
            entity: LogResourceName.USER,
            documentId: '123',
            operation: LogOperation.DELETE,
            changes: {
                deleted: true
            }
        },
        {
            _id: '000000000000000000000003',
            datetime: new Date(2019, 6, 3, 21, 10, 40),         // 2
            userId: 'abc',
            entity: LogResourceName.USER,
            documentId: '123',
            operation: LogOperation.UPDATE,
            changes: {
                one: 2,
                two: 'four'
            }
        },
        {
            _id: '000000000000000000000004',
            datetime: new Date(2019, 5, 13, 10, 33, 30),        // 1
            userId: 'abc',
            entity: LogResourceName.USER,
            documentId: '123',
            operation: LogOperation.CREATE,
            changes: {
                one: 1,
                two: 'two',
                deleted: false
            }
        }
    ],

    usergrouplogs: [],

    rolelogs: []

};
