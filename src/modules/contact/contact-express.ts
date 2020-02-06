
// import * as passport from 'passport';
import { Request, Response, NextFunction } from 'express';

import { contactControllerSingleton as ContactController } from './contact-controller';
import { IContactModel } from './contact-model';
import { IContactRegisterBody, IContactUpdateBody } from './contact-interface';
import { contactDalSingleton as ContactDal } from './contact-dal';
import { requestMetadataSingleton as ReqMetadataFactory } from '../../shared/helpers/request-metadata-factory';
// import { requestAuthenticationModuleSingleton as RequestAuthenticationModule } from '../permission/req-auth-module';

class ContactExpressLayer {

    constructor() { }

    // /**
    //  * middleware to generate a session token for some given contact credentials.
    //  *
    //  * if successful sends json response with generated token and contact id, like so:
    //  *  {
    //  *      uid: string,
    //  *      token: string
    //  *  }
    //  *
    //  * req.body must contain 'contactname' and 'password' properties:
    //  * {
    //  *     contactname: string,
    //  *     password: string
    //  * }
    //  *
    //  * this method is here because it cannot be trivially decoupled from the req, res and next Express objects.
    //  */
    // public login(req: Request, res: Response, next: NextFunction) {
    //     passport.authenticate('local', (err, contact, info) => {
    //         if (err) {
    //             res.status(404).json(err);
    //             return;
    //         }

    //         if (contact) {
    //             // contact is found
    //             if (contact.deleted) {
    //                 res.status(401).json(err);  // unauthorized
    //             } else {
    //                 res.status(200).json({
    //                     uid: contact._id.toString(),
    //                     token: contact.generateJwt()
    //                 });
    //             }
    //         }
    //         else {
    //             // contact is not found
    //             res.status(401).json(info);     // unauthorized
    //         }
    //     })(req, res, next);
    // }

    // /**
    //  * middleware used by the client to answer a request for authentication (login) which was initiated by the server (via sockets)
    //  *
    //  * if authentication succeeds, any stalled requests waiting for authentication will behave as follows:
    //  *
    //  *      if authenticated contact is the same as stalled request contact,
    //  *          stalled request continues
    //  *      otherwise
    //  *          stalled request fails
    //  *
    //  * if authentication fails, any stalled requests waiting for authentication will fail with 403 Forbidden
    //  *
    //  * this method is here because it cannot be trivially decoupled from the req, res and next Express objects.
    //  */
    // public replyLogin(req: Request, res: Response, next: NextFunction) {
    //     const meta = ReqMetadataFactory.create(req);
    //     if (!meta || !meta.clientId) {
    //         next(new Error('unidentified client'));
    //         return;
    //     }

    //     passport.authenticate('local', (err, contact, info) => {
    //         if (err)
    //             RequestAuthenticationModule.fail(401, meta.clientId);
    //         else if (contact) {

    //             // contact is found
    //             if (contact.deleted)
    //                 RequestAuthenticationModule.fail(401, meta.clientId, contact._id.toString());
    //             else
    //                 RequestAuthenticationModule.succeed(meta.clientId, contact._id.toString());

    //         }
    //         else {
    //             // contact is not found
    //             RequestAuthenticationModule.fail(401, meta.clientId);
    //         }

    //         res.status(200).json({});
    //     })(req, res, next);
    // }

    public register(req: Request, res: Response, next: NextFunction) {

        const contactData: IContactRegisterBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        ContactController.createContact(contactData, meta).subscribe(
            (contact: IContactModel) => res.status(200).json(contact),
            err => next(err)
        );
    }

    public getAllContacts(req: Request, res: Response, next: NextFunction) {
        ContactController.getContacts().subscribe(
            (contacts: IContactModel[]) => res.status(200).json(contacts),
            err => next(err)
        );
    }

    public getContactById(req: Request, res: Response, next: NextFunction) {

        const contactId = req.params.id;

        ContactController.getContactById(contactId).subscribe(
            (contact: IContactModel) => res.status(200).json(contact),
            err => next(err)
        );
    }

    public updateContact(req: Request, res: Response, next: NextFunction) {

        const contactId = req.params.id;
        const contactData: IContactUpdateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        ContactController.updateContact(contactId, contactData, meta).subscribe(
            (contact: IContactModel) => res.status(200).json(contact),
            err => next(err)
        );
    }

    public createContact(req: Request, res: Response, next: NextFunction) {

        const contactData: IContactRegisterBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        ContactController.createContact(contactData, meta).subscribe(
            (contact: IContactModel) => res.status(200).json(contact),
            err => next(err)
        );
    }

    public deleteContact(req: Request, res: Response, next: NextFunction) {

        const contactId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        ContactController.deleteContact(contactId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }
}

export const contactExpressLayerSingleton = new ContactExpressLayer();
