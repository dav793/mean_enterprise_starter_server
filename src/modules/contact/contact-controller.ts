import {Observable, of} from 'rxjs';
import {concatMap, map, tap} from 'rxjs/operators';

import SocketIOServer from '../../shared/lib/socket.io/socket';
import {IUpdateRolesPayload, IUpdateContactsPayload, SocketMessageType} from '../../shared/lib/socket.io/socket-types';

import {contactDalSingleton as ContactDal} from './contact-dal';
import {IContactModel} from './contact-model';
import {IContactRegisterBody, IContactUpdateBody} from './contact-interface';
import {IReqMetadata} from '../../shared/helpers/request-metadata-factory';
import {logControllerSingleton as LogController} from '../log/log-controller';
import {LogOperation, LogResourceName} from '../log/log-enums';

class ContactController {

    constructor() { }

    getContacts(): Observable<IContactModel[]> {
        return ContactDal.getContacts();
    }

    // getContactsWithRole(roleId: string): Observable<IContactModel[]> {
    //     return ContactDal.getContactsWithRole(roleId);
    // }

    getContactById(contactId: string): Observable<IContactModel | null> {
        return ContactDal.getContactById(contactId);
    }

    revertContact(contactId: string, contactData: IContactUpdateBody, meta: IReqMetadata = {}): Observable<IContactModel> {
        return this.getContactById(contactId).pipe(
            concatMap((oldContact: IContactModel) => {

                return ContactDal.updateContact(contactId, contactData).pipe(
                    concatMap((contact: IContactModel) => {

                        return LogController.logOperation(LogResourceName.USER, LogOperation.REVERT, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IContactModel) => {

                        const data: IUpdateContactsPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

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

                        return LogController.logOperation(LogResourceName.USER, LogOperation.UPDATE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IContactModel) => {

                        const data: IUpdateContactsPayload = {
                            originatorId: meta ? meta.clientId : null
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                        return of(contact);

                    })
                );

            })
        );
    }

    createContact(contactData: IContactRegisterBody, meta: IReqMetadata = {}): Observable<IContactModel> {
        return ContactDal.createContact(contactData).pipe(
            concatMap((contact: IContactModel) => {

                return LogController.logOperation(LogResourceName.USER, LogOperation.CREATE, {}, contact.toObject(), meta)
                    .pipe( map(() => contact) );

            }),
            concatMap((contact: IContactModel) => {

                const data: IUpdateContactsPayload = {
                    originatorId: meta.clientId
                };

                SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                return of(contact);

            })
        );
    }

    deleteContact(contactId: string, meta: IReqMetadata = {}): Observable<boolean> {
        return this.getContactById(contactId).pipe(
            concatMap((oldContact: IContactModel) => {

                return ContactDal.deleteContact(contactId).pipe(
                    concatMap((contact: IContactModel) => {

                        return LogController.logOperation(LogResourceName.USER, LogOperation.DELETE, oldContact.toObject(), contact.toObject(), meta)
                            .pipe( map(() => contact) );

                    }),
                    concatMap((contact: IContactModel) => {

                        const data: IUpdateRolesPayload = {
                            originatorId: meta.clientId
                        };

                        SocketIOServer.broadcast(SocketMessageType.UPDATE_USERS, data);

                        return of(contact);

                    }),
                    map(() => true)
                );

            })
        );
    }

}

export const contactControllerSingleton = new ContactController();
