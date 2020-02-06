
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { mongoServer } from '../../../shared/helpers/mongodb-memory-server';

import { Contact, IContactModel } from '../contact-model';
import { contactDalSingleton as ContactDal } from '../contact-dal';
import { ErrorName } from '../../../shared/enums/errors';

const dataset = require('./datasets/default');

describe('ContactDal => getContactById', () => {

    it('should find contact in DB', (done) => {

        ContactDal.getContactById('000000000000000000000000')
            .subscribe((contact: IContactModel) => {

                expect(contact._id.toString()).toEqual('000000000000000000000000');
                // expect(contact.contactname).toEqual('admin');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should emit null if no contact found with id', (done) => {

        ContactDal.getContactById('990000000000000000000000')
            .subscribe((contact: IContactModel|null) => {
                expect(contact).toBeNull();
                done();
            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        ContactDal.getContactById('INVALID ID FORMAT')
            .subscribe((contact: IContactModel|null) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.CAST_ERROR);
                done();
            });

    });

    it('should exclude hash and salt from fetched contact', (done) => {

        ContactDal.getContactById('000000000000000000000000')
            .subscribe((contact: IContactModel|null) => {

                expect(contact).not.toContain('hash');
                expect(contact).not.toContain('salt');
                done();

            }, err => {
                fail('should not throw any errors');
                done();
            });

    });

    beforeEach((done) => connectDb(done));
    afterEach(() => disconnectDb());

});

describe('ContactDal => updateContact', () => {

    it('should update contact in DB and emit updated contact', (done) => {

        const reqBody = {
            firstName: 'Manuel'
        };

        ContactDal.updateContact('000000000000000000000000', reqBody)
            .subscribe((contact: IContactModel) => {

                expect(contact._id.toString()).toEqual('000000000000000000000000');
                expect(contact.firstName).toEqual('Manuel');
                done();

            }, err => {
                fail(err);
                done();
            });

    });

    it('should throw IdNotFound error if no contact found with id', (done) => {

        const reqBody = {};

        ContactDal.updateContact('990000000000000000000000', reqBody)
            .subscribe((contact: IContactModel) => {
                fail('should not emit');
                done();
            }, err => {
                expect(err.name).toEqual(ErrorName.ID_NOT_FOUND);
                done();
            });

    });

    it('should throw CastError if id is invalid', (done) => {

        const reqBody = {};

        ContactDal.updateContact('INVALID ID FORMAT', reqBody)
            .subscribe((contact: IContactModel) => {
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

// describe('ContactDal => createContact', () => {

//     it('should create contact in DB and emit created contact', (done) => {

//         const reqBody = {
//             // contactname : 'mcab',
//             firstName : 'Manuel',
//             lastName : 'Cabrales',
//             email : 'test@email.com',
//             // password: '12345678'
//         };

//         ContactDal.createContact(reqBody)
//             .subscribe((contact: IContactModel) => {

//                 // expect(contact.contactname).toEqual('mcab');
//                 expect(contact.firstName).toEqual('Manuel');
//                 expect(contact.lastName).toEqual('Cabrales');
//                 done();

//             }, err => {
//                 fail(err);
//                 done();
//             });

//     });

//     it('should throw error if contactname is not unique', (done) => {

//         const reqBody = {
//             // contactname : 'admin',     // contactname is taken
//             firstName : 'Manuel',
//             lastName : 'Cabrales',
//             email : 'test@email.com',
//             // password: '12345678'
//         };

//         ContactDal.createContact(reqBody)
//             .subscribe((contact: IContactModel) => {
//                 fail('should not emit');
//                 done();
//             }, err => {
//                 expect(err.name).toEqual(ErrorName.NON_UNIQUE_USERNAME);
//                 done();
//             });

//     });

//     it('should throw error if password is not given', (done) => {

//         const reqBody = {
//             // contactname : 'mcab',
//             firstName : 'Manuel',
//             lastName : 'Cabrales',
//             email : 'test@email.com',
//             // password: '12345678'
//         };

//         ContactDal.createContact(reqBody as any)
//             .subscribe((contact: IContactModel) => {
//                 fail('should not emit');
//                 done();
//             }, err => {
//                 expect(err.name).toEqual(ErrorName.PASSWORD_MISSING);
//                 done();
//             });

//     });

//     beforeEach((done) => connectDb(done));
//     afterEach(() => disconnectDb());

// });

const loadDataset = () => from( Contact.create(dataset.contacts) );

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
