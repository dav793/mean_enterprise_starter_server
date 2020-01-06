
import { PermissionAction } from '../permission/permission-enums';
import { PermissionLevel } from '../permission/permission-enums';
import { ResourceName } from '../../../shared/enums/resources';

export interface IRole {
    name: string;
    resources: IResourcePermissions[];
    deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IResourcePermissions {
    name: ResourceName;
    permissions: IPermission[];
}

export interface IPermission {
    action: PermissionAction;
    level: PermissionLevel;
}

export interface IRoleUpdateBody {
    name?: string;
    resources?: IResourcePermissions[];
}

export interface IRoleCreateBody {
    name: string;
    resources: IResourcePermissions[];
}
