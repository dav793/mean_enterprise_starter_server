# Back-End Server - Technical Doc

## Index
* [Environment variables](#environment-variables)
* [Resources](#resources)
* [Permissions](#permissions)
* [Socket IO](#socket-io)
* [Helpers](#helpers)
* [Request Headers](#request-headers)
* [Operation Logging](#operation-logging)
* [Database](#database)

## Environment variables

Environment variables are defined in config/config.json.

They can be accessed in-code like so:

```typescript
import Config from 'src/shared/lib/config';

Config.get('HTTP-WS').AUTH.JWT_SECRET
```

## Resources

Resources comprise all the different entities whose access we want controlled. E.g. Users, Roles, Permissions, Contacts, etc. They often correspond directly to database models (e.g. User, Role...) but that is not always the case (e.g. Permission, Contact...).

Three core database entities provide all the necessary data to support resource access-control; Users, User Groups, and Roles.

## Permissions

The back-end server has a permission subsystem which allows per-role access-control to each application resource.

To protect a route you just need to add `authorize` to the route's middleware pipeline, like so:
```typescript
import { authorize } from 'src/modules/user/permission/permission-express';
import { PermissionAction, PermissionLevel } from 'src/modules/user/permission/permission-enums';
import { ResourceName } from 'src/shared/enums/resources';

this.router.get('/',
    ...
    authorize(ResourceName.NEW_RESOURCE, PermissionAction.READ, PermissionLevel.ALLOW),
    ...
);
```

When the route is activated, the server uses the request's session data to extract the initiating user and determine if she 
has sufficient permissions to perform such operation. If not, the request is responded to with a `403 Forbidden` error.

### How to add permission support for new resource types

Simply add the resource in the enum `ResourceName` at `src/shared/enums/resources.ts` (remember to also update the corresponding resources enum in the front-end client codebase, if needed).
```typescript
export enum ResourceName {
    ...
    NEW_RESOURCE = 'newResource'
}
```

Then, make sure to update the corresponding roles, otherwise none of your users will have sufficient permissions to operate the new resource (note that this may be intended, in which case you don't need to update any roles).

If you're using `scripts/setupDb.sh` to setup DB state, this comprises opening `scripts/createUsers.js`, looking for the `resources` property on the
roles you wish to update, and appending the resource entry. You will end up with something like this:
```typescript
db.roles.insert({
    ...
    "resources": [
        ...
        {
            "name": "newResource",
            "permissions": [
                { "action": "create",   "level": 3 },
                { "action": "read",     "level": 3 },
                { "action": "update",   "level": 3 },
                { "action": "delete",   "level": 3 }
            ]
        }
    ],
    ...
});
```

Otherwise you will need to either do it manually on the DB or through the front-end app.

### * Please Note *

The enum `src/shared/enums/resources.ts` which lists the app resources, should **always** be identical to the corresponding one in the client project. 

We should eventually implement an external configuration provider for both the client & server to remedy this.

## Socket IO

This application uses [Socket IO](https://socket.io/) to establish a full-duplex communication channel with each client. Every message passed through this channel should be of a defined type. Socket Message Types are defined in `src/shared/lib/socket.io/socket-types.ts`.

### * Please Note *

The enum `src/shared/lib/socket.io/socket-types.ts` should **always** be identical to the corresponding one in the client project. 

We should eventually implement an external configuration provider for both the client & server to remedy this.

## Helpers

### RequestMetadataFactory

Use the `RequestMetadataFactory` helper to extract useful metadata from express request objects, such as the client ID that originated the request.

```typescript
import { requestMetadataSingleton as ReqMetadataFactory } from './src/shared/helpers/request-metadata-factory';

const req: Request;
const meta = ReqMetadataFactory.create(req);
```

## Request Headers
The following is a list of the headers that may be present in HTTP requests serviced by this application:
* Authorization : Bearer JWT for the active session.
* App-Client-Id : Uniquely identifies a single instance (browser tab) of the client application. Is application-defined.
* App-User-Id : Uniquely identifies the user which performs a request. Corresponds to the _id of a user document in the DB. 

## Operation Logging

The operation logging subsystem has the purpose of saving a record of every DB state-altering operation performed by any user, and to allow the reconstruction of any past DB state.

A dedicated logging collection is created for each regular collection. Operation logs are added to this logging collection as they occur.

A logging collection is named as its singular corresponding regular collection, with the `logs` prefix. Example: `usergroups` -> `usergrouplogs` 

A logging entry contains the following data about a particular operation:
* Date & time of the operation.
* ID of the executing user.
* Name of the affected collection.
* ID of the affected document.
* Operation type identifier
* Changes applied to the document as a result of the operation (as a json object).

### How to add support for logging new resource types

These steps may feel a bit cumbersome and boilerplatey,
but they add type safety and the certainty that things will work just as long as these steps are
followed, and that makes it worth it.

* Add the new resource type in `LogResourceName` at `src/modules/log/log-enums.ts`.
    ```typescript
    export enum LogResourceName {
        ...
        NEW_RESOURCE = 'newResource'
    }
    ```

* Add in `src/modules/log/log-model.ts`:

    * At the top, start by importing the resource model's interface
        ```typescript
        import {INewResourceModel} from '../new-resource/new-resource-model';
        ```
    
    * Then, add the log model's interface:
        ```typescript
        export interface INewResourceLogModel extends IOperationLog, Document {
            _id: Types.ObjectId;
        }
        ```
        
    * Add the schema for the DB documents.
        ```typescript
        export let NewResourceLogSchema: Schema = new Schema({
            datetime: Date,
            userId: String,
            entity: String,
            documentId: String,
            operation: String,
            changes: Schema.Types.Mixed
        });
        ```
        
    * Next, add the mongoose model initialization.
        ```typescript
        export const NewResourceLog: Model<INewResourceLogModel> = model<INewResourceLogModel>('NewResourceLog', NewResourceLogSchema);
        ```
        
    * Finally update the types `IAnyLogModel` and `IAnyEntityModel` at the end.
        ```typescript
        export type IAnyLogModel = ... | INewResourceLogModel;
        export type IAnyEntityModel = ... | INewResourceModel;
        ```

* Add in `OperationLogDal` at `src/modules/log/log-dal.ts`:

    * First, import the resource DAL class and log model interface and mongoose model.
        ```typescript
        import { newResourceDalSingleton as NewResourceDal } from '../new-resource/new-resource-dal';
              
        ...
  
        import {
            ...
            INewResourceLogModel,
            NewResourceLog
        } from './log-model';
        ```
        
    * Then, add the DAL methods (copy/paste and edit from the ones already there). The methods are:
        ```
        getNewResourceLogs()
        getNewResourceLogsByIdAfterDate()
        getNewResourceLogById()
        addNewResourceLog()
        ```

    * Finally, add the new switch case inside the method `findDocumentByEntity`.
        ```typescript
        case LogResourceName.NEW_RESOURCE:
            return NewResourceDal.getNewResourceById(docId) as Observable<IAnyEntityModel>;
        ```

* Add in `LogController` at `src/modules/log/log-controller.ts`:

    * First, import the resource's controller.
        ```typescript
        import { newResourceControllerSingleton as NewResourceController } from '../new-resource/new-resource-controller';
        ```
        
    * Then, add the switch case inside the method `logOperation`.
        ```typescript
        case LogResourceName.NEW_RESOURCE:
            action = OperationLogDal.addNewResourceLog;
        ```
        
    * Finally, do the same inside the method `revertDocumentState`. You must add a case in both switches here.
        ```typescript
        case LogResourceName.NEW_RESOURCE:
            logsFetcher = OperationLogDal.getNewResourceLogsByIdAfterDate(targetLogEntry.documentId, targetLogEntry.datetime);
            break;
      
        ...
  
        case LogResourceName.NEW_RESOURCE:
            saveAction = NewResourceController.revertNewResource(targetLogEntry.documentId, newDoc as any, meta);
            break;
        ```
        
* And you're done!

## Database

### Formats

Every document ID which serves as primary key (i.e. the `_id` property), is stored as a mongo ObjectId object.

Every document ID which is stored as a secondary key in any document, is stored as a string, not a mongo ObjectId object.

Every date is stored as a mongo Date object. 

Whenever dates are required to be parsed as strings, or strings are required to be parsed as Date objects, the following format is used by default: `D/M/YYYY H:mm:ss`.

