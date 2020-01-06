import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { mongoServer } from '../../../shared/helpers/mongodb-memory-server';

import { ErrorName } from '../../../shared/enums/errors';
import { logControllerSingleton as LogController } from '../log-controller';
import { LogOperation, LogResourceName } from '../log-enums';
import {
    IUserLogModel,
    IRoleLogModel,
    IUserGroupLogModel,
    UserLog,
    RoleLog,
    UserGroupLog
} from '../log-model';

describe('LogController => logOperation', () => {

    it('should correctly log a CREATE operation', (done) => {

        const original = {};

        const modified = {
            _id: 'abc',
            one: 1,
            two: 'three',
            three: [{one: 1}, {two: 2.5}],
            four: {one: 'one', two: 'two'}
        };

        LogController.logOperation(LogResourceName.ROLE, LogOperation.CREATE, original, modified, {userId: '123'})
            .pipe( switchMap(() => from( RoleLog.find({}) )) )
            .subscribe(
                (logs: IRoleLogModel[]) => {

                    expect(logs.length).toEqual(1);
                    expect(logs[0].datetime).toBeDefined();
                    expect(logs[0].userId).toEqual('123');
                    expect(logs[0].entity).toEqual(LogResourceName.ROLE);
                    expect(logs[0].documentId).toEqual('abc');
                    expect(logs[0].operation).toEqual(LogOperation.CREATE);
                    expect(logs[0].changes).toBeDefined();
                    expect(logs[0].changes.two).toBeDefined();
                    expect(logs[0].changes.two).toEqual('three');
                    expect(logs[0].changes.three).toBeDefined();
                    expect(logs[0].changes.three.length).toEqual(2);
                    expect(logs[0].changes.three[0]).toEqual({one: 1});
                    expect(logs[0].changes.three[1]).toEqual({two: 2.5});
                    expect(logs[0].changes.four).toBeDefined();
                    expect(Object.keys(logs[0].changes.four).length).toEqual(2);
                    expect(logs[0].changes.four.one).toEqual('one');
                    expect(logs[0].changes.four.two).toEqual('two');
                    done();

                },
                err => {
                    fail(err);
                    done();
                }
            );

    });

    it('should correctly log an UPDATE operation', (done) => {

        const original = {
            _id: 'abc',
            one: 1,
            two: 'two',
            three: [{one: 1}, {two: 2}],
            four: {one: 1, two: 'two'}
        };

        const modified = {
            _id: 'abc',
            one: 1,
            two: 'three',
            three: [{one: 1}, {two: 2.5}],
            four: {one: 'one', two: 'two'}
        };

        LogController.logOperation(LogResourceName.USER, LogOperation.UPDATE, original, modified, {userId: '123'})
            .pipe( switchMap(() => from( UserLog.find({}) )) )
            .subscribe(
                (logs: IUserLogModel[]) => {

                    expect(logs.length).toEqual(1);
                    expect(logs[0].datetime).toBeDefined();
                    expect(logs[0].userId).toEqual('123');
                    expect(logs[0].entity).toEqual(LogResourceName.USER);
                    expect(logs[0].documentId).toEqual('abc');
                    expect(logs[0].operation).toEqual(LogOperation.UPDATE);
                    expect(logs[0].changes).toBeDefined();
                    expect(logs[0].changes.two).toBeDefined();
                    expect(logs[0].changes.two).toEqual('three');
                    expect(logs[0].changes.three).toBeDefined();
                    expect(logs[0].changes.three.length).toEqual(2);
                    expect(logs[0].changes.three[0]).toEqual({one: 1});
                    expect(logs[0].changes.three[1]).toEqual({two: 2.5});
                    expect(logs[0].changes.four).toBeDefined();
                    expect(Object.keys(logs[0].changes.four).length).toEqual(2);
                    expect(logs[0].changes.four.one).toEqual('one');
                    expect(logs[0].changes.four.two).toEqual('two');
                    done();

                },
                err => {
                    fail(err);
                    done();
                }
            );

    });

    it('should correctly log a DELETE operation', (done) => {

        const original = {
            _id: 'abc',
            one: 1,
            two: 'two',
            three: [{one: 1}, {two: 2}],
            four: {one: 1, two: 'two'},
            deleted: false
        };

        const modified = {
            _id: 'abc',
            one: 1,
            two: 'two',
            three: [{one: 1}, {two: 2}],
            four: {one: 1, two: 'two'},
            deleted: true
        };

        LogController.logOperation(LogResourceName.USER_GROUP, LogOperation.DELETE, original, modified, {userId: '123'})
            .pipe( switchMap(() => from( UserGroupLog.find({}) )) )
            .subscribe(
                (logs: IUserGroupLogModel[]) => {

                    expect(logs.length).toEqual(1);
                    expect(logs[0].datetime).toBeDefined();
                    expect(logs[0].userId).toEqual('123');
                    expect(logs[0].entity).toEqual(LogResourceName.USER_GROUP);
                    expect(logs[0].documentId).toEqual('abc');
                    expect(logs[0].operation).toEqual(LogOperation.DELETE);
                    expect(logs[0].changes).toBeDefined();
                    expect(logs[0].changes.deleted).toBeDefined();
                    expect(logs[0].changes.deleted).toEqual(true);
                    done();

                },
                err => {
                    fail(err);
                    done();
                }
            );

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('LogController => valuesAreDifferent', () => {

    it('should correctly verify that two strings are different', (done) => {
        const original = 'abc';
        const modified = 'abz';
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two strings are equal', (done) => {
        const original = 'abc';
        const modified = 'abc';
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two numbers are different', (done) => {
        const original = 10.15089;
        const modified = 10.1509;
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two numbers are equal', (done) => {
        const original = 10.15089;
        const modified = 10.15089;
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two single-level objects are different', (done) => {

        const original = {
            one: 1,
            two: 'two'
        };

        const modified = {
            one: 1,
            two: 'three'
        };

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two single-level objects are equal', (done) => {

        const original = {
            one: 1,
            two: 'two'
        };

        const modified = {
            one: 1,
            two: 'two'
        };

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should throw an error when two single-level objects have different properties', (done) => {

        const original = {
            one: 1,
            two: 'two'
        };

        const modified = {
            one: 1,
            three: 'two'
        };

        try {
            const isDifferent = LogController.valuesAreDifferent(original, modified);
        }
        catch(e) {
            expect(e.name).toEqual(ErrorName.INCOMPATIBLE_OBJ_STRUCT);
        }
        done();
    });

    it('should correctly verify that two two-level objects are different', (done) => {

        const original = {
            one: {
                one: 1,
                two: 'two'
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const modified = {
            one: {
                one: 1,
                two: 'two'
            },
            two: {
                two: 3,
                three: 'three'
            }
        };

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two two-level objects are equal', (done) => {

        const original = {
            one: {
                one: 1,
                two: 'two'
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const modified = {
            one: {
                one: 1,
                two: 'two'
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two three-level objects are different', (done) => {

        const original = {
            one: {
                one: 1,
                two: {
                    three: 3,
                    four: 'four'
                }
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const modified = {
            one: {
                one: 1,
                two: {
                    three: 3,
                    four: 'five'
                }
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two three-level objects are equal', (done) => {

        const original = {
            one: {
                one: 1,
                two: {
                    three: 3,
                    four: 'four'
                }
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const modified = {
            one: {
                one: 1,
                two: {
                    three: 3,
                    four: 'four'
                }
            },
            two: {
                two: 2,
                three: 'three'
            }
        };

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two single-level arrays are different', (done) => {
        const original = [1, 2, 'three'];
        const modified = [1, 3, 'three'];
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two single-level arrays are equal', (done) => {
        const original = [1, 2, 'three'];
        const modified = [1, 2, 'three'];
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two two-level arrays are different', (done) => {
        const original = [[1, 2], ['three', 'four']];
        const modified = [[1, 2], ['four', 'four']];
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two two-level arrays are equal', (done) => {
        const original = [[1, 2], ['three', 'four']];
        const modified = [[1, 2], ['three', 'four']];
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two single-level arrays of objects are different', (done) => {
        const original = [{one: 1}, {two: 2}];
        const modified = [{one: 1}, {two: 3}];
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two single-level arrays of objects are equal', (done) => {
        const original = [{one: 1}, {two: 2}];
        const modified = [{one: 1}, {two: 2}];
        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

    it('should correctly verify that two single-level arrays of two-level objects are different', (done) => {

        const original = [
            {one: { two: 'two' }},
            {two: { three: 'three' }}
        ];

        const modified = [
            {one: { two: 'two' }},
            {two: { three: 'four' }}
        ];

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(true);
        done();
    });

    it('should correctly verify that two single-level arrays of two-level objects are equal', (done) => {

        const original = [
            {one: { two: 'two' }},
            {two: { three: 'three' }}
        ];

        const modified = [
            {one: { two: 'two' }},
            {two: { three: 'three' }}
        ];

        const isDifferent = LogController.valuesAreDifferent(original, modified);
        expect(isDifferent).toEqual(false);
        done();
    });

});

describe('LogController => extractDifferences', () => {

    it('should extract no differences in two objects with primitive values if they are equal', (done) => {

        const original = {
            one: 'abc',
            two: 5
        };

        const modified = {
            two: 5,
            one: 'abc',
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with primitive values', (done) => {

        const original = {
            one: 'abc',
            two: 5
        };

        const modified = {
            two: 5,
            one: 'def',
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).toBeDefined();
        expect(diff.one).toEqual('def');
        expect(diff.two).not.toBeDefined();
        done();

    });

    it('should extract no differences in two objects with single-level array values if they are equal', (done) => {

        const original = {
            one: [1, 'two'],
            two: [3, 'four']
        };

        const modified = {
            one: [1, 'two'],
            two: [3, 'four']
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with single-level array values', (done) => {

        const original = {
            one: [1, 'two'],
            two: [3, 'four']
        };

        const modified = {
            one: [1, 'two'],
            two: [4, 'four']
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).not.toBeDefined();
        expect(diff.two).toBeDefined();
        expect(diff.two.length).toEqual(2);
        expect(diff.two).toEqual([4, 'four']);
        done();

    });

    it('should extract no differences in two objects with two-level array values if they are equal', (done) => {

        const original = {
            one: [
                [1, 2],
                [3, 4]
            ],
            two: [
                [1, 2],
                [3, 4]
            ]
        };

        const modified = {
            one: [
                [1, 2],
                [3, 4]
            ],
            two: [
                [1, 2],
                [3, 4]
            ]
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with two-level array values', (done) => {

        const original = {
            one: [
                [1, 2],
                [3, 4]
            ],
            two: [
                [1, 2],
                [3, 4]
            ]
        };

        const modified = {
            one: [
                [1, 2],
                [3, 4]
            ],
            two: [
                [1, 2],
                [3, 5]
            ]
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).not.toBeDefined();
        expect(diff.two).toBeDefined();
        expect(diff.two.length).toEqual(2);
        expect(diff.two[0]).toEqual([1, 2]);
        expect(diff.two[1]).toEqual([3, 5]);
        done();

    });

    it('should extract no differences in two objects with single-level arrays of objects if they are equal', (done) => {

        const original = {
            one: [{one: 1}, {two: 2}],
            two: [{three: 3}, {four: 4}]
        };

        const modified = {
            one: [{one: 1}, {two: 2}],
            two: [{three: 3}, {four: 4}]
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with single-level arrays of objects', (done) => {

        const original = {
            one: [{one: 1}, {two: 2}],
            two: [{three: 3}, {four: 4}]
        };

        const modified = {
            one: [{one: 1}, {two: 2}],
            two: [{three: 3}, {four: 5}]
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).not.toBeDefined();
        expect(diff.two).toBeDefined();
        expect(diff.two.length).toEqual(2);
        expect(diff.two[0]).toEqual({three: 3});
        expect(diff.two[1]).toEqual({four: 5});
        done();

    });

    it('should extract no differences in two objects with two-level arrays of objects if they are equal', (done) => {

        const original = {
            one: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ],
            two: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ]
        };

        const modified = {
            one: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ],
            two: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ]
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with two-level arrays of objects', (done) => {

        const original = {
            one: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ],
            two: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ]
        };

        const modified = {
            one: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 4}]
            ],
            two: [
                [{one: 1}, {two: 2}],
                [{three: 3}, {four: 5}]
            ]
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).not.toBeDefined();
        expect(diff.two).toBeDefined();
        expect(diff.two.length).toEqual(2);
        expect(diff.two[0].length).toEqual(2);
        expect(diff.two[0][0]).toEqual({one: 1});
        expect(diff.two[0][1]).toEqual({two: 2});
        expect(diff.two[1].length).toEqual(2);
        expect(diff.two[1][0]).toEqual({three: 3});
        expect(diff.two[1][1]).toEqual({four: 5});
        done();

    });

    it('should extract no differences in two objects with single-level objects if they are equal', (done) => {

        const original = {
            one: {one: 1, two: 2},
            two: {three: 3, four: 4}
        };

        const modified = {
            one: {one: 1, two: 2},
            two: {three: 3, four: 4}
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with single-level objects', (done) => {

        const original = {
            one: {one: 1, two: 2},
            two: {three: 3, four: 4}
        };

        const modified = {
            one: {one: 1, two: 2},
            two: {three: 3, four: 5}
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).not.toBeDefined();
        expect(diff.two).toBeDefined();
        expect(Object.keys(diff.two).length).toEqual(2);
        expect(diff.two.three).toBeDefined();
        expect(diff.two.three).toEqual(3);
        expect(diff.two.four).toBeDefined();
        expect(diff.two.four).toEqual(5);
        done();

    });

    it('should extract no differences in two objects with two-level objects if they are equal', (done) => {

        const original = {
            one: {
                one: {one: 1},
                two: {two: 2}
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const modified = {
            one: {
                one: {one: 1},
                two: {two: 2}
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with two-level objects', (done) => {

        const original = {
            one: {
                one: {one: 1},
                two: {two: 2}
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const modified = {
            one: {
                one: {one: 1},
                two: {two: 2}
            },
            two: {
                three: {one: 1},
                four: {two: 3}
            }
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.one).not.toBeDefined();
        expect(diff.two).toBeDefined();
        expect(Object.keys(diff.two).length).toEqual(2);
        expect(diff.two.three).toBeDefined();
        expect(diff.two.three).toEqual({one: 1});
        expect(diff.two.four).toBeDefined();
        expect(diff.two.four).toEqual({two: 3});
        done();

    });

    it('should extract no differences in two objects with mixed structures if they are equal', (done) => {

        const original = {
            one: {
                one: {one: 1},
                two: [1, 'two'],
                three: {
                    one: ['one', 2, {one: 1}],
                    two: {
                        one: [1, 2]
                    }
                }
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const modified = {
            one: {
                one: {one: 1},
                two: [1, 'two'],
                three: {
                    one: ['one', 2, {one: 1}],
                    two: {
                        one: [1, 2]
                    }
                }
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toEqual({});
        done();

    });

    it('should correctly extract differences in two objects with mixed structures', (done) => {

        const original = {
            one: {
                one: {one: 1},
                two: [1, 'two'],
                three: {
                    one: ['one', 2, {one: 1}],
                    two: {
                        one: [1, 2]
                    }
                }
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const modified = {
            one: {
                one: {one: 1},
                two: [1, 'two'],
                three: {
                    one: ['one', 2, {one: 99}],
                    two: {
                        one: [1, 2]
                    }
                }
            },
            two: {
                three: {one: 1},
                four: {two: 2}
            }
        };

        const diff = LogController.extractDifferences(original, modified);
        expect(diff).toBeDefined();
        expect(diff.two).not.toBeDefined();
        expect(diff.one).toBeDefined();
        expect(Object.keys(diff.one).length).toEqual(3);
        expect(diff.one.one).toBeDefined();
        expect(diff.one.one).toEqual({one: 1});
        expect(diff.one.two).toBeDefined();
        expect(diff.one.two).toEqual([1, 'two']);
        expect(diff.one.three).toBeDefined();
        expect(Object.keys(diff.one.three).length).toEqual(2);
        expect(diff.one.three.two).toBeDefined();
        expect(Object.keys(diff.one.three.two).length).toEqual(1);
        expect(diff.one.three.two.one).toBeDefined();
        expect(diff.one.three.two.one).toEqual([1, 2]);
        expect(diff.one.three.one).toBeDefined();
        expect(diff.one.three.one.length).toEqual(3);
        expect(diff.one.three.one[0]).toEqual('one');
        expect(diff.one.three.one[1]).toEqual(2);
        expect(diff.one.three.one[2]).toEqual({one: 99});
        done();

    });

});

const loadDataset = () => of(null);

const connectDb = (done) => {
    mongoServer.createConnection().pipe(
        switchMap(() => loadDataset())
    ).subscribe(
        () => done(),
        err => {
            fail(err);
            done();
        }
    );
};

const disconnectDb = () => mongoServer.destroyConnection();
