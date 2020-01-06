
export interface IAddress {
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
}

export interface IPhoneNumber {
    phoneNumber: string,
    detail: string
}

export interface IIdentification {
    idType: string,
    idNumber: string,
    expirationDate: Date,
    isMainId: boolean
}

export interface ICorporateRepresentative {
    name: string,
    relation: string,
    participationPercentage: number,
    addressLine: string
}

export interface ICommercialReference {
    name: string,
    phoneNumber: string
}

export interface IPhysicalContact {
    contactType: string,
    firstName: string,
    middleName: string,
    lastName: string,
    mothersMaidenName: string,
    gender: string,
    maritalStatus: string,
    nationalities: string[],
    countryOfBirth: string,
    birthDate: Date,
    homePhoneNumber: string,
    mobilePhoneNumber: string,
    email: string,
    isPep: boolean,
    identifications: IIdentification[],
    addresses: IAddress[],
    profession: string,
    jobPosition: string,
    companyName: string,
    companyActivity: string,
    companyPhoneNumber: string,
    companyAddressLine: string,
    grossMonthlyIncome: number,
    sourcesOfIncome: string,
    sourcesOfFunds: string[],
    otherSourcesOfFunds: string,
    countriesOfFundsOrigin: string[],
    purposeOfFunds: string[],
    otherPurposesOfFunds: string,
    estimatedAmountOfTransactions: string,
    deleted: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

export interface ICorporateContact {
    contactType: string,
    corporationName: string,
    corporationType: string,
    corporationIdNumber: string,
    dateOfConstitution: Date,
    countryOfConstitution: string,
    email: string,
    languagesSpoken: string[],
    phoneNumbers: IPhoneNumber[],
    isPep: boolean,
    namesOfPeps: string[],
    corporateRepresentatives: ICorporateRepresentative[],
    commercialReferences: ICommercialReference[],
    addresses: IAddress[],
    companyActivity: string,
    grossMonthlyIncome: number,
    sourcesOfIncome: string,
    sourcesOfFunds: string[],
    otherSourcesOfFunds: string,
    countriesOfFundsOrigin: string[],
    purposeOfFunds: string[],
    otherPurposesOfFunds: string,
    estimatedAmountOfTransactions: string,
    deleted: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

export interface IPhysicalContactCreateBody {
    contactType?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    mothersMaidenName?: string,
    gender?: string,
    maritalStatus?: string,
    nationalities?: string[],
    countryOfBirth?: string,
    birthDate?: Date,
    homePhoneNumber?: string,
    mobilePhoneNumber?: string,
    email?: string,
    isPep?: boolean,
    identifications?: IIdentification[],
    addresses?: IAddress[],
    profession?: string,
    jobPosition?: string,
    companyName?: string,
    companyActivity?: string,
    companyPhoneNumber?: string,
    companyAddressLine?: string,
    grossMonthlyIncome?: number,
    sourcesOfIncome?: string,
    sourcesOfFunds?: string[],
    otherSourcesOfFunds?: string,
    countriesOfFundsOrigin?: string[],
    purposeOfFunds?: string[],
    otherPurposesOfFunds?: string,
    estimatedAmountOfTransactions?: string
}

export interface IPhysicalContactUpdateBody {
    contactType?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    mothersMaidenName?: string,
    gender?: string,
    maritalStatus?: string,
    nationalities?: string[],
    countryOfBirth?: string,
    birthDate?: Date,
    homePhoneNumber?: string,
    mobilePhoneNumber?: string,
    email?: string,
    isPep?: boolean,
    identifications?: IIdentification[],
    addresses?: IAddress[],
    profession?: string,
    jobPosition?: string,
    companyName?: string,
    companyActivity?: string,
    companyPhoneNumber?: string,
    companyAddressLine?: string,
    grossMonthlyIncome?: number,
    sourcesOfIncome?: string,
    sourcesOfFunds?: string[],
    otherSourcesOfFunds?: string,
    countriesOfFundsOrigin?: string[],
    purposeOfFunds?: string[],
    otherPurposesOfFunds?: string,
    estimatedAmountOfTransactions?: string
}

export interface ICorporateContactCreateBody {
    contactType?: string,
    corporationName?: string,
    corporationType?: string,
    corporationIdNumber?: string,
    dateOfConstitution?: Date,
    countryOfConstitution?: string,
    email?: string,
    languagesSpoken?: string[],
    phoneNumbers?: IPhoneNumber[];
    isPep?: boolean,
    namesOfPeps?: string[],
    corporateRepresentatives?: ICorporateRepresentative[],
    commercialReferences?: ICommercialReference[],
    addresses?: IAddress[],
    companyActivity?: string,
    grossMonthlyIncome?: number,
    sourcesOfIncome?: string,
    sourcesOfFunds?: string[],
    otherSourcesOfFunds?: string,
    countriesOfFundsOrigin?: string[],
    purposeOfFunds?: string[],
    otherPurposesOfFunds?: string,
    estimatedAmountOfTransactions?: string,
    deleted?: boolean;
}

export interface ICorporateContactUpdateBody {
    contactType?: string,
    corporationName?: string,
    corporationType?: string,
    corporationIdNumber?: string,
    dateOfConstitution?: Date,
    countryOfConstitution?: string,
    email?: string,
    languagesSpoken?: string[],
    phoneNumbers?: IPhoneNumber[];
    isPep?: boolean,
    namesOfPeps?: string[],
    corporateRepresentatives?: ICorporateRepresentative[],
    commercialReferences?: ICommercialReference[],
    addresses?: IAddress[],
    companyActivity?: string,
    grossMonthlyIncome?: number,
    sourcesOfIncome?: string,
    sourcesOfFunds?: string[],
    otherSourcesOfFunds?: string,
    countriesOfFundsOrigin?: string[],
    purposeOfFunds?: string[],
    otherPurposesOfFunds?: string,
    estimatedAmountOfTransactions?: string,
    deleted?: boolean;
}
