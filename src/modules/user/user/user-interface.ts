
export interface IUser {
    username: string;
    firstName?: string;
    lastName?: string;
    secondLastName?: string;
    email?: string;
    roleIds?: string[];
    updatePassword?: boolean;
    deleted?: boolean;
}

export interface IUserUpdateBody {
    firstName?: string;
    lastName?: string;
    email?: string;
    roleIds?: string[];
    updatePassword?: boolean;
}

export interface IUserRegisterBody {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roleIds?: string[];
    password: string;
}
