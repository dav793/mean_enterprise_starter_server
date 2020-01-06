import { Document, Schema, Model, model, Types} from 'mongoose';

import { IPhysicalContact } from './contact-interface';

export interface IPhysicalContactModel extends IPhysicalContact, Document {
    _id: Types.ObjectId;
}

export let IdentificationSchema: Schema = new Schema({
    idType: String,
    idNumber: String,
    expirationDate: Date,
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

export let PhysicalContactSchema: Schema = new Schema({
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
    mothersMaidenName: {
        type: String
    },
    gender: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    nationalities: {
        type: [String]
    },
    countryOfBirth: {
        type: String
    },
    birthDate: {
        type: Date
    },
    homePhoneNumber: {
        type: String
    },
    mobilePhoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    isPep: {
        type: Boolean,
        default: false
    },
    identifications: {
        type: [IdentificationSchema]
    },
    address: {
        type: [AddressSchema]
    },
    profession: {
        type: String
    },
    jobPosition: {
        type: String
    },
    companyName: {
        type: String
    },
    companyActivity: {
        type: String
    },
    companyPhoneNumber: {
        type: String
    },
    companyAddressLine: {
        type: String
    },
    grossMonthlyIncome: {
        type: Number
    },
    sourcesOfIncome: {
        type: String
    },
    sourcesOfFunds: {
        type: [String]
    },
    otherSourcesOfFunds: {
        type: String
    },
    countriesOfFundsOrigin: {
        type: [String]
    },
    purposeOfFunds: {
        type: [String]
    },
    otherPurposesOfFunds: {
        type: String
    },
    estimatedAmountOfTransactions: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const PhysicalContact: Model<IPhysicalContactModel> = model<IPhysicalContactModel>('PhysicalContact', PhysicalContactSchema);
