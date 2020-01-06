import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PhysicalContact, IPhysicalContactModel } from './physical-contact-model';
import { IPhysicalContactCreateBody, IPhysicalContactUpdateBody } from './contact-interface';
import { ErrorName } from '../../shared/enums/errors';

class PhysicalContactDal {

    constructor() { }

    getContacts(): Observable<IPhysicalContactModel[]> {
        return from( PhysicalContact.find( {deleted: { $ne: true }} ) );
    }

    getContactById(contactId: string): Observable<IPhysicalContactModel|null> {
        return from( PhysicalContact.findById(contactId) );
    }

    createContact(contactData: IPhysicalContactCreateBody): Observable<IPhysicalContactModel> {
        return from( PhysicalContact.create(contactData) );
    }

    updateContact(contactId: string, contactData: IPhysicalContactUpdateBody): Observable<IPhysicalContactModel> {
        return this.getContactById(contactId).pipe(
            switchMap(contact => {
                if (contact) {
                    return from( PhysicalContact.findByIdAndUpdate(contactId, contactData, {new: true}) );
                }
                else {
                    const err = new Error(`physical contact with id ${contactId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })
        );
    }

    deleteContact(contactId: string): Observable<IPhysicalContactModel> {
        return this.updateContact(contactId, { deleted: true } as any);
    }

}

export const physicalContactDalSingleton = new PhysicalContactDal();
