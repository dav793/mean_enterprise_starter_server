
export interface IAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface IIdentification {
    idType: string;
    idNumber: string;
    expirationDate: Date;
    isMainId: boolean;
}

export interface IContact {
    contactType: string;

    firstName: string;
    middleName: string;
    lastName: string;
    salutation: string;
    alias: string;
    gender: string;
    maritalStatus: string;
    dateOfBirth: string;
    countryOfBirth: string;

    corporateName: string;
    dateOfConstitution: string;
    countryOfConstitution: string;

    homePhoneNumber: string;
    mobilePhoneNumber: string;
    workPhoneNumber: string;
    email: string;
    identifications: IIdentification[];
    addresses: IAddress[];
    profession: string;
    jobPosition: string;

    deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IContactCreateBody {
    contactType: string;

    firstName: string;
    middleName: string;
    lastName: string;
    salutation: string;
    alias: string;
    gender: string;
    maritalStatus: string;
    dateOfBirth: string;
    countryOfBirth: string;

    corporateName: string;
    dateOfConstitution: string;
    countryOfConstitution: string;

    homePhoneNumber: string;
    mobilePhoneNumber: string;
    workPhoneNumber: string;
    email: string;
    identifications: IIdentification[];
    addresses: IAddress[];
    profession: string;
    jobPosition: string;
}

export interface IContactUpdateBody {
    contactType?: string;

    firstName?: string;
    middleName?: string;
    lastName?: string;
    salutation?: string;
    alias?: string;
    gender?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
    countryOfBirth?: string;

    corporateName?: string;
    dateOfConstitution?: string;
    countryOfConstitution?: string;

    homePhoneNumber?: string;
    mobilePhoneNumber?: string;
    workPhoneNumber?: string;
    email?: string;
    identifications?: IIdentification[];
    addresses?: IAddress[];
    profession?: string;
    jobPosition?: string;

    deleted?: boolean;
}
