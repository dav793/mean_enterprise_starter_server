
class RequestMetadataFactory {

    constructor() {}

    create(req): IReqMetadata {
        const options = {};
        const clientId = typeof req.header === 'function' ? req.header('App-Client-Id') : null;
        const userId = typeof req.header === 'function' ? req.header('App-User-Id') : null;

        if (clientId)
            options['clientId'] = clientId;

        if (userId)
            options['userId'] = userId;

        return options;
    }

}

export interface IReqMetadata {
    clientId?: string;
    userId?: string;
}

export const requestMetadataSingleton = new RequestMetadataFactory();
