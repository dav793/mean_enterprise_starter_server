
export interface IContact {
    // username: string;
    firstName?: string;
    lastName?: string;
    // secondLastName?: string;
    email?: string;
    // roleIds?: string[];
    // updatePassword?: boolean;
    deleted?: boolean;
}

export interface IContactUpdateBody {
    firstName?: string;
    lastName?: string;
    email?: string;
    // roleIds?: string[];
    // updatePassword?: boolean;
}

export interface IContactRegisterBody {
    // username: string;
    firstName: string;
    lastName: string;
    email: string;
    // roleIds?: string[];
    // password: string;
}
