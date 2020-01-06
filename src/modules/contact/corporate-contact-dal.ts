import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CorporateContact, ICorporateContactModel } from './corporate-contact-model';
import { ICorporateContactCreateBody, ICorporateContactUpdateBody } from './contact-interface';
import { ErrorName } from '../../shared/enums/errors';

class CorporateContactDal {

    constructor() { }

    getContacts(): Observable<ICorporateContactModel[]> {
        return from( CorporateContact.find( {deleted: { $ne: true }} ) );
    }

    getContactById(contactId: string): Observable<ICorporateContactModel|null> {
        return from( CorporateContact.findById(contactId) );
    }

    createContact(contactData: ICorporateContactCreateBody): Observable<ICorporateContactModel> {
        return from( CorporateContact.create(contactData) );
    }

    updateContact(contactId: string, contactData: ICorporateContactUpdateBody): Observable<ICorporateContactModel> {
        return this.getContactById(contactId).pipe(
            switchMap(contact => {
                if (contact) {
                    return from( CorporateContact.findByIdAndUpdate(contactId, contactData, {new: true}) );
                }
                else {
                    const err = new Error(`corporate contact with id ${contactId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })
        );
    }

    deleteContact(contactId: string): Observable<ICorporateContactModel> {
        return this.updateContact(contactId, { deleted: true } as any);
    }

}

export const corporateContactDalSingleton = new CorporateContactDal();
