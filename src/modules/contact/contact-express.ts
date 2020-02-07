import { Request, Response, NextFunction } from 'express';

import { requestMetadataSingleton as ReqMetadataFactory} from '../../shared/helpers/request-metadata-factory';

import { contactControllerSingleton as ContactController } from './contact-controller';
import { IContactCreateBody, IContactUpdateBody } from './contact-interface';
import { IContactModel } from './contact-model';

class ContactExpressLayer {
    constructor() { }

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

    public createContact(req: Request, res: Response, next: NextFunction) {
        const contactData: IContactCreateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        ContactController.createContact(contactData, meta).subscribe(
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

    public deleteContact(req: Request, res: Response, next: NextFunction) {
        const contactId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        ContactController.deleteContact(contactId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }
}

export const ContactExpressLayerSingleton = new ContactExpressLayer();
