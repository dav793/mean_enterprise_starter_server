import { Request, Response, NextFunction } from 'express';

import { requestMetadataSingleton as ReqMetadataFactory} from '../../shared/helpers/request-metadata-factory';

import { contactControllerSingleton as ContactController, IAnyContactModel } from './contact-controller';
import {
    IPhysicalContactCreateBody,
    IPhysicalContactUpdateBody,
    ICorporateContactCreateBody,
    ICorporateContactUpdateBody
} from './contact-interface';

class ContactExpressLayer {
    constructor() { }

    public getAllContacts(req: Request, res: Response, next: NextFunction) {
        ContactController.getContacts().subscribe(
            (contacts: IAnyContactModel[]) => res.status(200).json(contacts),
            err => next(err)
        );
    }

    public getContactById(req: Request, res: Response, next: NextFunction) {
        const contactId = req.params.id;

        ContactController.getContactById(contactId).subscribe(
            (contact: IAnyContactModel) => res.status(200).json(contact),
            err => next(err)
        );
    }

    public createContact(req: Request, res: Response, next: NextFunction) {
        const contactData: IPhysicalContactCreateBody | ICorporateContactCreateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        ContactController.createContact(contactData, meta).subscribe(
            (contact: IAnyContactModel) => res.status(200).json(contact),
            err => next(err)
        );
    }

    public updateContact(req: Request, res: Response, next: NextFunction) {
        const contactId = req.params.id;
        const contactData: IPhysicalContactUpdateBody | ICorporateContactUpdateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        ContactController.updateContact(contactId, contactData, meta).subscribe(
            (contact: IAnyContactModel) => res.status(200).json(contact),
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
