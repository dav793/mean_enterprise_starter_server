import {forkJoin, Observable, of, throwError} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import SocketIOServer from '../../shared/lib/socket.io/socket';
import {
    IUpdatePhysicalContactsPayload,
    IUpdateCorporateContactsPayload,
    SocketMessageType
} from '../../shared/lib/socket.io/socket-types';

import { IReqMetadata } from '../../shared/helpers/request-metadata-factory';
import { ErrorName } from '../../shared/enums/errors';
import { ContactTypes } from '../../shared/lists/contact-types';

import { logControllerSingleton as LogController } from '../log/log-controller';
import { LogOperation, LogResourceName } from '../log/log-enums';

import { physicalContactDalSingleton as PhysicalContactDal } from './physical-contact-dal';
import { corporateContactDalSingleton as CorporateContactDal } from './corporate-contact-dal';
import { IPhysicalContactModel } from './physical-contact-model';
import { ICorporateContactModel } from './corporate-contact-model';
import {
    IPhysicalContactCreateBody,
    IPhysicalContactUpdateBody,
    ICorporateContactCreateBody,
    ICorporateContactUpdateBody
} from './contact-interface';

class ContactController {

    constructor() { }

    getContacts(): Observable<IAnyContactModel[]> {
        return forkJoin(
            this.getPhysicalContacs(),
            this.getCorporateContacs()
        ).pipe(
            concatMap(([physicalContacts, corporateContacts]) => of(
                (physicalContacts as IAnyContactModel[]).concat(corporateContacts)
            ))
        );
    }

    getContactById(contactId: string): Observable<IAnyContactModel|null> {
        return forkJoin(
            this.getPhysicalContactById(contactId),
            this.getCorporateContactById(contactId)
        ).pipe(
            concatMap(([physicalContact, corporateContact]) => {
                if (physicalContact)
                    return of(physicalContact);
                else if (corporateContact)
                    return of(corporateContact);
                else
                    return of(null);
            })
        );
    }

    revertContact(contactId: string, contactData: IPhysicalContactUpdateBody | ICorporateContactUpdateBody, meta: IReqMetadata = {}): Observable<IAnyContactModel> {
        if (ContactTypes.isPhysicalContact(contactData.contactType))
            return this.revertPhysicalContact(contactId, contactData, meta);
        else if (ContactTypes.isCorporateContact(contactData.contactType))
            return this.revertCorporateContact(contactId, contactData, meta);
        else {
            const err = new Error(`contact data is invalid: contactType missing or unrecognized`);
            err.name = ErrorName.INVALID_OBJ_STRUCT;
            return throwError(err);
        }
    }

    updateContact(contactId: string, contactData: IPhysicalContactUpdateBody | ICorporateContactUpdateBody, meta: IReqMetadata = {}): Observable<IAnyContactModel> {
        if (ContactTypes.isPhysicalContact(contactData.contactType))
            return this.updatePhysicalContact(contactId, contactData, meta);
        else if (ContactTypes.isCorporateContact(contactData.contactType))
            return this.updateCorporateContact(contactId, contactData, meta);
        else {
            const err = new Error(`contact data is invalid: contactType missing or unrecognized`);
            err.name = ErrorName.INVALID_OBJ_STRUCT;
            return throwError(err);
        }
    }

    createContact(contactData: IPhysicalContactUpdateBody | ICorporateContactUpdateBody, meta: IReqMetadata = {}): Observable<IAnyContactModel> {
        if (ContactTypes.isPhysicalContact(contactData.contactType))
            return this.createPhysicalContact(contactData, meta);
        else if (ContactTypes.isCorporateContact(contactData.contactType))
            return this.createCorporateContact(contactData, meta);
        else {
            const err = new Error(`contact data is invalid: contactType missing or unrecognized`);
            err.name = ErrorName.INVALID_OBJ_STRUCT;
            return throwError(err);
        }
    }

    deleteContact(contactId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getContactById(contactId).pipe(
            concatMap((contact: IAnyContactModel|null) => {
                if (!contact) {
                    const err = new Error(`contact with id ${contactId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
                else if (ContactTypes.isPhysicalContact(contact.contactType)) {
                    return this.deletePhysicalContact(contactId, meta);
                }
                else if (ContactTypes.isCorporateContact(contact.contactType)) {
                    return this.deleteCorporateContact(contactId, meta);
                }
                else {
                    const err = new Error(`contact data is invalid: contactType missing or unrecognized`);
                    err.name = ErrorName.INVALID_OBJ_STRUCT;
                    return throwError(err);
                }
            })
        );
    }

    private getPhysicalContacs(): Observable<IPhysicalContactModel[]> {
        return PhysicalContactDal.getContacts();
    }

    private getCorporateContacs(): Observable<ICorporateContactModel[]> {
        return CorporateContactDal.getContacts();
    }

    private getPhysicalContactById(contactId: string): Observable<IPhysicalContactModel|null> {
        return PhysicalContactDal.getContactById(contactId);
    }

    private getCorporateContactById(contactId: string): Observable<ICorporateContactModel|null> {
        return CorporateContactDal.getContactById(contactId);
    }

    private revertPhysicalContact(contactId: string, contactData: IPhysicalContactUpdateBody, meta: IReqMetadata = {}): Observable<IPhysicalContactModel> {
        return this.getPhysicalContactById(contactId).pipe(
            concatMap((oldContact: IPhysicalContactModel) => {

                return PhysicalContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: IPhysicalContactModel) => {

                        return LogController.logOperation(LogResourceName.PHYSICAL_CONTACT, LogOperation.REVERT, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IPhysicalContactModel) => {

                        const data: IUpdatePhysicalContactsPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_PHYSICAL_CONTACTS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    private revertCorporateContact(contactId: string, contactData: ICorporateContactUpdateBody, meta: IReqMetadata = {}): Observable<ICorporateContactModel> {
        return this.getCorporateContactById(contactId).pipe(
            concatMap((oldContact: ICorporateContactModel) => {

                return CorporateContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: ICorporateContactModel) => {

                        return LogController.logOperation(LogResourceName.CORPORATE_CONTACT, LogOperation.REVERT, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: ICorporateContactModel) => {

                        const data: IUpdateCorporateContactsPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_CORPORATE_CONTACTS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    private updatePhysicalContact(contactId: string, contactData: IPhysicalContactUpdateBody, meta: IReqMetadata = {}): Observable<IPhysicalContactModel> {
        return this.getPhysicalContactById(contactId).pipe(
            concatMap((oldContact: IPhysicalContactModel) => {

                return PhysicalContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: IPhysicalContactModel) => {

                        return LogController.logOperation(LogResourceName.PHYSICAL_CONTACT, LogOperation.UPDATE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IPhysicalContactModel) => {

                        const data: IUpdatePhysicalContactsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_PHYSICAL_CONTACTS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    private updateCorporateContact(contactId: string, contactData: ICorporateContactUpdateBody, meta: IReqMetadata = {}): Observable<ICorporateContactModel> {
        return this.getCorporateContactById(contactId).pipe(
            concatMap((oldContact: ICorporateContactModel) => {

                return CorporateContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: ICorporateContactModel) => {

                        return LogController.logOperation(LogResourceName.CORPORATE_CONTACT, LogOperation.UPDATE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: ICorporateContactModel) => {

                        const data: IUpdateCorporateContactsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_CORPORATE_CONTACTS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    private createPhysicalContact(contactData: IPhysicalContactCreateBody, meta: IReqMetadata = {}): Observable<IPhysicalContactModel> {
        return PhysicalContactDal.createContact(contactData).pipe(
            concatMap((contact: IPhysicalContactModel) => {

                return LogController.logOperation(LogResourceName.PHYSICAL_CONTACT, LogOperation.CREATE, {}, contact.toObject(), meta)
                    .pipe( map(() => contact) );

            }),
            concatMap((contact: IPhysicalContactModel) => {

                const data: IUpdatePhysicalContactsPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_PHYSICAL_CONTACTS, data);

                return of(contact);

            })
        );
    }

    private createCorporateContact(contactData: ICorporateContactCreateBody, meta: IReqMetadata = {}): Observable<ICorporateContactModel> {
        return CorporateContactDal.createContact(contactData).pipe(
            concatMap((contact: ICorporateContactModel) => {

                return LogController.logOperation(LogResourceName.CORPORATE_CONTACT, LogOperation.CREATE, {}, contact.toObject(), meta)
                    .pipe( map(() => contact) );

            }),
            concatMap((contact: ICorporateContactModel) => {

                const data: IUpdateCorporateContactsPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_CORPORATE_CONTACTS, data);

                return of(contact);

            })
        );
    }

    private deletePhysicalContact(contactId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getPhysicalContactById(contactId).pipe(
            concatMap((oldContact: IPhysicalContactModel) => {

                return PhysicalContactDal.deleteContact(contactId).pipe(
                    concatMap((contact: IPhysicalContactModel) => {

                        return LogController.logOperation(LogResourceName.PHYSICAL_CONTACT, LogOperation.DELETE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IPhysicalContactModel) => {

                        const data: IUpdatePhysicalContactsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_PHYSICAL_CONTACTS, data);

                        return of(contact);

                    }),
                    map(() => true)
                );

            })
        );
    }

    private deleteCorporateContact(contactId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getCorporateContactById(contactId).pipe(
            concatMap((oldContact: ICorporateContactModel) => {

                return CorporateContactDal.deleteContact(contactId).pipe(
                    concatMap((contact: ICorporateContactModel) => {

                        return LogController.logOperation(LogResourceName.CORPORATE_CONTACT, LogOperation.DELETE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: ICorporateContactModel) => {

                        const data: IUpdateCorporateContactsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_CORPORATE_CONTACTS, data);

                        return of(contact);

                    }),
                    map(() => true)
                );

            })
        );
    }

}

export const contactControllerSingleton = new ContactController();

export type IAnyContactModel = IPhysicalContactModel | ICorporateContactModel;
