
export enum LogOperation {
    CREATE      = 'create',
    UPDATE      = 'update',
    DELETE      = 'delete',
    REVERT      = 'revert'
}

export enum LogResourceName {
    USER                = 'user',
    USER_GROUP          = 'userGroup',
    ROLE                = 'role',
    CONTACT             = 'contact',
    RELATION_DEFINITION     = 'relationDefinition',
    RELATION_INSTANCE       = 'relationInstance'
}
