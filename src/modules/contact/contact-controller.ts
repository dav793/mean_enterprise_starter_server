import {forkJoin, Observable, of, throwError} from 'rxjs';
import {concatMap, map, mergeMap} from 'rxjs/operators';

import SocketIOServer from '../../shared/lib/socket.io/socket';
import { IUpdateContactsPayload, SocketMessageType } from '../../shared/lib/socket.io/socket-types';

import { IReqMetadata } from '../../shared/helpers/request-metadata-factory';
import { ErrorName } from '../../shared/enums/errors';
import { ContactTypes } from '../../shared/lists/contact-types';

import { logControllerSingleton as LogController } from '../log/log-controller';
import { LogOperation, LogResourceName } from '../log/log-enums';

import { contactDalSingleton as ContactDal } from './contact-dal';
import { IContactModel } from './contact-model';
import { IContact, IContactCreateBody, IContactUpdateBody } from './contact-interface';

class ContactController {

    constructor() { }

    getContacts(): Observable<IContactModel[]> {
        return ContactDal.getContacts();
    }

    getContactById(contactId: string): Observable<IContactModel|null> {
        return ContactDal.getContactById(contactId);
    }

    revertContact(contactId: string, contactData: IContactUpdateBody, meta: IReqMetadata = {}): Observable<IContactModel> {
        return this.getContactById(contactId).pipe(
            concatMap((oldContact: IContactModel) => {

                return ContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: IContactModel) => {

                        return LogController.logOperation(LogResourceName.CONTACT, LogOperation.REVERT, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IContactModel) => {

                        const data: IUpdateContactsPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_CONTACTS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    updateContact(contactId: string, contactData: IContactUpdateBody, meta: IReqMetadata = {}): Observable<IContactModel> {
        return this.getContactById(contactId).pipe(
            concatMap((oldContact: IContactModel) => {

                return ContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: IContactModel) => {

                        return LogController.logOperation(LogResourceName.CONTACT, LogOperation.UPDATE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IContactModel) => {

                        const data: IUpdateContactsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_CONTACTS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    createContact(contactData: IContactCreateBody, meta: IReqMetadata = {}): Observable<IContactModel> {
        return ContactDal.createContact(contactData).pipe(
            concatMap((contact: IContactModel) => {

                return LogController.logOperation(LogResourceName.CONTACT, LogOperation.CREATE, {}, contact.toObject(), meta)
                    .pipe( map(() => contact) );

            }),
            concatMap((contact: IContactModel) => {

                const data: IUpdateContactsPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_CONTACTS, data);

                return of(contact);

            })
        );
    }

    deleteContact(contactId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getContactById(contactId).pipe(
            concatMap((oldContact: IContactModel) => {

                return ContactDal.deleteContact(contactId).pipe(
                    concatMap((contact: IContactModel) => {

                        return LogController.logOperation(LogResourceName.CONTACT, LogOperation.DELETE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IContactModel) => {

                        const data: IUpdateContactsPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_CONTACTS, data);

                        return of(contact);

                    }),
                    map(() => true)
                );

            })
        );
    }

}

export const contactControllerSingleton = new ContactController();
