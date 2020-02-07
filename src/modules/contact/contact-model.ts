import { Document, Schema, Model, model, Types} from 'mongoose';

import {IAddress, IContact, IIdentification} from './contact-interface';

export interface IContactModel extends IContact, Document {
    _id: Types.ObjectId;
}

export let IdentificationSchema: Schema = new Schema({
    idType: String,
    idNumber: String,
    expirationDate: Date,
    expeditedBy: String,
    isMainId: {
        type: Boolean,
        default: false
    }
});

export let AddressSchema: Schema = new Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: Number
});

export let ContactSchema: Schema = new Schema({
    contactType: {
        type: String
    },
    firstName: {
        type: String
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    salutation: {
        type: String
    },
    alias: {
        type: String
    },
    gender: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    countryOfBirth: {
        type: String
    },
    corporateName: {
        type: String
    },
    dateOfConstitution: {
        type: String
    },
    countryOfConstitution: {
        type: String
    },
    homePhoneNumber: {
        type: String
    },
    mobilePhoneNumber: {
        type: String
    },
    workPhoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    identifications: {
        type: [IdentificationSchema]
    },
    addresses: {
        type: [AddressSchema]
    },
    profession: {
        type: String
    },
    jobPosition: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Contact: Model<IContactModel> = model<IContactModel>('Contact', ContactSchema);
