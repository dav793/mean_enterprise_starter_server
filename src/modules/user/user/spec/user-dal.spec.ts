
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { mongoServer } from '../../../../shared/helpers/mongodb-memory-server';

import { User, IUserModel } from '../user-model';
import { userDalSingleton as UserDal } from '../user-dal';
import { ErrorName } from '../../../../shared/enums/errors';

const dataset = require('./datasets/default');

describe('UserDal => getUserById', () => {

    it('should find user in DB', (done) => {

        UserDal.getUserById('000000000000000000000000')
            .subscribe((user: IUserModel) => {

                expect(user._id.toString()).toEqual('000000000000000000000000');
                expect(user.username).toEqual('admin');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should emit null if no user found with id', (done) => {

        UserDal.getUserById('990000000000000000000000')
            .subscribe((user: IUserModel|null) => {
                expect(user).toBeNull();
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        UserDal.getUserById('INVALID ID FORMAT')
            .subscribe((user: IUserModel|null) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.CAST_ERROR);
                done();
            });

    });

    it('should exclude hash and salt from fetched user', (done) => {

        UserDal.getUserById('000000000000000000000000')
            .subscribe((user: IUserModel|null) => {

                expect(user).not.toContain('hash');
                expect(user).not.toContain('salt');
                done();

            }, err => {
                fail('should not throw any errors');
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('UserDal => updateUser', () => {

    it('should update user in DB and emit updated user', (done) => {

        const reqBody = {
            firstName: 'Manuel'
        };

        UserDal.updateUser('000000000000000000000000', reqBody)
            .subscribe((user: IUserModel) => {

                expect(user._id.toString()).toEqual('000000000000000000000000');
                expect(user.firstName).toEqual('Manuel');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw IdNotFound error if no user found with id', (done) => {

        const reqBody = {};

        UserDal.updateUser('990000000000000000000000', reqBody)
            .subscribe((user: IUserModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.ID_NOT_FOUND);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        const reqBody = {};

        UserDal.updateUser('INVALID ID FORMAT', reqBody)
            .subscribe((user: IUserModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.CAST_ERROR);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('UserDal => createUser', () => {

    it('should create user in DB and emit created user', (done) => {

        const reqBody = {
            username : 'mcab',
            firstName : 'Manuel',
            lastName : 'Cabrales',
            email : 'test@email.com',
            password: '12345678'
        };

        UserDal.createUser(reqBody)
            .subscribe((user: IUserModel) => {

                expect(user.username).toEqual('mcab');
                expect(user.firstName).toEqual('Manuel');
                expect(user.lastName).toEqual('Cabrales');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw error if username is not unique', (done) => {

        const reqBody = {
            username : 'admin',     // username is taken
            firstName : 'Manuel',
            lastName : 'Cabrales',
            email : 'test@email.com',
            password: '12345678'
        };

        UserDal.createUser(reqBody)
            .subscribe((user: IUserModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.NON_UNIQUE_USERNAME);
                done();
            });

    });

    it('should throw error if password is not given', (done) => {

        const reqBody = {
            username : 'mcab',
            firstName : 'Manuel',
            lastName : 'Cabrales',
            email : 'test@email.com',
            // password: '12345678'
        };

        UserDal.createUser(reqBody as any)
            .subscribe((user: IUserModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.PASSWORD_MISSING);
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

const loadDataset = () => from( User.create(dataset.users) );

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
