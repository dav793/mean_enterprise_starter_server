import { Observable, from, throwError, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Contact, IContactModel } from './contact-model';
import { IContactRegisterBody, IContactUpdateBody } from './contact-interface';
// import { Role, IRoleModel, DefaultRoleName } from '../role/role-model';
import { ErrorName } from '../../shared/enums/errors';

import { getSalt, getHash } from '../../shared/helpers/crypto-utils';

class ContactDal {

    constructor() { }

    getContacts(): Observable<IContactModel[]> {
        return from(Contact.find({}).select('-hash -salt'));
    }

    // getContactsWithRole(roleId: string): Observable<IContactModel[]> {
    //     const query = { roleIds: { $elemMatch: { $eq: roleId } } };
    //     return from( Contact.find(query).select('-hash -salt') );
    // }

    getContactById(contactId: string): Observable<IContactModel | null> {
        return from( Contact.findById(contactId).select('-hash -salt') );
    }

    updateContact(contactId: string, contactData: IContactUpdateBody): Observable<IContactModel> {
        return this.getContactById(contactId).pipe(
            switchMap((contact: IContactModel) => {
                if (contact) {

                    contact.firstName = contactData.firstName ? contactData.firstName : contact.firstName;
                    contact.lastName = contactData.lastName ? contactData.lastName : contact.lastName;
                    contact.email = contactData.email ? contactData.email : contact.email;
                    // contact.roleIds = contactData.roleIds ? contactData.roleIds : contact.roleIds;
                    // contact.updatePassword = contactData.updatePassword || false;

                    return from(contact.save());

                }
                else {
                    const err = new Error(`contact with id ${contactId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })

        );
    }

     // Revisar //////////////////////////////////////////////////////////////////////////////////// 
    createContact(contactData: IContactRegisterBody): Observable<IContactModel> {
        return forkJoin(
            Contact.findOne({ firstName: contactData.firstName }) // ,
            // Role.findOne({ name: DefaultRoleName })
        ).pipe(
            switchMap(([existingContact/*, defaultRole*/]) => {
                if (!existingContact) {
                    const contact = new Contact();

                    // contact.contactname = contactData.contactname;
                    contact.firstName = contactData.firstName;
                    contact.lastName = contactData.lastName;
                    contact.email = contactData.email;
                    // contact.roleIds = contactData.roleIds || defaultRole ? [defaultRole._id.toString()] : [];
                    // contact.updatePassword = true;

                    // if (contactData.password) {
                    //     contact.salt = getSalt();
                    //     contact.hash = getHash(contact.salt.toString(), contactData.password);
                    //     contact.updatePassword = false;
                    //     return from(contact.save());
                    // }
                    // else {
                    //     const err = new Error('must set a password');
                    //     err.name = ErrorName.PASSWORD_MISSING;
                    //     return throwError(err);
                    // }

                }
                else {
                    const err = new Error('contactname must be unique');
                    err.name = ErrorName.NON_UNIQUE_USERNAME;
                    return throwError(err);
                }
            })

        );
    }

    deleteContact(contactId: string): Observable<IContactModel> {
        return this.updateContact(contactId, { deleted: true } as any);
    }

}

export const contactDalSingleton = new ContactDal();
