import { Document, Schema, Model, model, Types} from 'mongoose';

import { ICorporateContact } from './contact-interface';

export interface ICorporateContactModel extends ICorporateContact, Document {
    _id: Types.ObjectId;
}

export let AddressSchema: Schema = new Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: Number
});

export let PhoneNumberSchema: Schema = new Schema({
    phoneNumber: String,
    detail: String
});

export let CorporateRepresentativeSchema: Schema = new Schema({
    name: String,
    relation: String,
    participationPercentage: Number,
    addressLine: String
});

export let CommercialReferenceSchema: Schema = new Schema({
    name: String,
    phoneNumber: String
});

export let CorporateContactSchema: Schema = new Schema({
    contactType: {
        type: String
    },
    corporationName: {
        type: String
    },
    corporationType: {
        type: String
    },
    corporationIdNumber: {
        type: String
    },
    dateOfConstitution: {
        type: Date
    },
    countryOfConstitution: {
        type: String
    },
    email: {
        type: String
    },
    languagesSpoken: {
        type: [String]
    },
    phoneNumbers: {
        type: [PhoneNumberSchema]
    },
    isPep: {
        type: Boolean,
        default: false
    },
    namesOfPeps: {
        type: [String]
    },
    corporateRepresentatives: {
        type: [CorporateRepresentativeSchema]
    },
    commercialReferences: {
        type: [CommercialReferenceSchema]
    },
    addresses: {
        type: [AddressSchema]
    },
    companyActivity: {
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

export const CorporateContact: Model<ICorporateContactModel> = model<ICorporateContactModel>('CorporateContact', CorporateContactSchema);
