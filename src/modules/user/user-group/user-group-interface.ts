
export interface IUserGroup {
    label: string;
    userIds: string[];
    roleIds: string[];
    deleted?: boolean;
}

export interface IUserGroupUpdateBody {
    label?: string;
    userIds?: string[];
    roleIds?: string[];
}

export interface IUserGroupCreateBody {
    label: string;
    userIds: string[];
    roleIds: string[];
}
