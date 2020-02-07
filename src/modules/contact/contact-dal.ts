import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Contact, IContactModel } from './contact-model';
import { IContactCreateBody, IContactUpdateBody } from './contact-interface';
import { ErrorName } from '../../shared/enums/errors';

class ContactDal {

    constructor() {}

    getContacts(): Observable<IContactModel[]> {
        return from( Contact.find( {deleted: { $ne: true }} ) );
    }

    getContactById(contactId: string): Observable<IContactModel|null> {
        return from( Contact.findById(contactId) );
    }

    createContact(contactData: IContactCreateBody): Observable<IContactModel> {
        return from( Contact.create(contactData) );
    }

    updateContact(contactId: string, contactData: IContactUpdateBody): Observable<IContactModel> {
        return this.getContactById(contactId).pipe(
            switchMap(contact => {
                if (contact) {
                    return from( Contact.findByIdAndUpdate(contactId, contactData, {new: true}) );
                }
                else {
                    const err = new Error(`contact with id ${contactId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
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
