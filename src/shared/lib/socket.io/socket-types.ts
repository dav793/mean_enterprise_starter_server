/**
 * WARNING
 * any changes made to this file HAVE to also be made to its counterpart in the client in: 'src/app/@shared/lib/socket.io/socket-types',
 * the two files should ALWAYS be identical (except for this doc).
 *
 * yes, this is an ugly solution.
 * but it is only a temporary solution, and a quick one at that
 *
 * this should eventually be imported remotely from the server
 */

export enum SocketMessageType {
    ASSIGN_CLIENT_ID                = 'assignClientId',
    REQUEST_AUTHENTICATION          = 'requestAuthentication',
    UPDATE_USERS                    = 'updateUsers',
    UPDATE_USER_GROUPS              = 'updateUserGroups',
    UPDATE_ROLES                    = 'updateRoles',
    UPDATE_PHYSICAL_CONTACTS        = 'updatePhysicalContacts',
    UPDATE_CORPORATE_CONTACTS       = 'updateCorporateContacts',
    UPDATE_ACCOUNTS                 = 'updateAccounts'
}

// create an interface here for every type of payload that may be sent by a socket message type

export interface IAssignClientIdPayload {
    clientId: string;
}

export interface IRequestAuthenticationPayload {
    clientId: string;
    originatorId: string;
}

export interface IUpdateUsersPayload {
    originatorId: string;
}

export interface IUpdateUserGroupsPayload {
    originatorId: string;
}

export interface IUpdateRolesPayload {
    originatorId: string;
}

export interface IUpdatePhysicalContactsPayload {
    originatorId: string;
}

export interface IUpdateCorporateContactsPayload {
    originatorId: string;
}

export interface IUpdateAccountsPayload {
    originatorId: string;
}

export type SocketMessagePayloadType =  IAssignClientIdPayload |        // <- add individual payload types to union type
                                        IRequestAuthenticationPayload |
                                        IUpdateUsersPayload |
                                        IUpdateUserGroupsPayload |
                                        IUpdateRolesPayload |
                                        IUpdatePhysicalContactsPayload |
                                        IUpdateCorporateContactsPayload |
                                        IUpdateAccountsPayload |
                                        {};

export interface ISocketMessage {
    type: SocketMessageType;
    data?: SocketMessagePayloadType;
    clientId?: string;
}