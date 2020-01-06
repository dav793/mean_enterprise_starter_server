import { LogOperation, LogResourceName } from './log-enums';

export interface IOperationLog {
    datetime: Date;
    userId: string;
    entity: LogResourceName;
    documentId: string;
    operation: LogOperation;
    changes: {[key: string]: any};
}
