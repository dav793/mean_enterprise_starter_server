import {Document, model, Model, Schema, Types} from 'mongoose';
import {IOperationLog} from './log-interface';
import {IUserModel} from '../user/user/user-model';
import {IUserGroupModel} from '../user/user-group/user-group-model';
import {IRoleModel} from '../user/role/role-model';
import { IContactModel } from '../contact/contact-model';
// import {IPhysicalContactModel} from '../contact/physical-contact-model';
// import {ICorporateContactModel} from '../contact/corporate-contact-model';

export interface IUserLogModel extends IOperationLog, Document {
    _id: Types.ObjectId;
}

export interface IUserGroupLogModel extends IOperationLog, Document {
    _id: Types.ObjectId;
}

export interface IRoleLogModel extends IOperationLog, Document {
    _id: Types.ObjectId;
}

// export interface IPhysicalContactLogModel extends IOperationLog, Document {
//     _id: Types.ObjectId;
// }

// export interface ICorporateContactLogModel extends IOperationLog, Document {
//     _id: Types.ObjectId;
// }

export interface IContactLogModel extends IOperationLog, Document {
    _id: Types.ObjectId;
}

export let UserLogSchema: Schema = new Schema({
    datetime: Date,
    userId: String,
    entity: String,
    documentId: String,
    operation: String,
    changes: Schema.Types.Mixed
});

export let UserGroupLogSchema: Schema = new Schema({
    datetime: Date,
    userId: String,
    entity: String,
    documentId: String,
    operation: String,
    changes: Schema.Types.Mixed
});

export let RoleLogSchema: Schema = new Schema({
    datetime: Date,
    userId: String,
    entity: String,
    documentId: String,
    operation: String,
    changes: Schema.Types.Mixed
});

// export let PhysicalContactLogSchema: Schema = new Schema({
//     datetime: Date,
//     userId: String,
//     entity: String,
//     documentId: String,
//     operation: String,
//     changes: Schema.Types.Mixed
// });

// export let CorporateContactLogSchema: Schema = new Schema({
//     datetime: Date,
//     userId: String,
//     entity: String,
//     documentId: String,
//     operation: String,
//     changes: Schema.Types.Mixed
// });

export let ContactLogSchema: Schema = new Schema({
    datetime: Date,
    userId: String,
    entity: String,
    documentId: String,
    operation: String,
    changes: Schema.Types.Mixed
});

export const UserLog: Model<IUserLogModel> = model<IUserLogModel>('UserLog', UserLogSchema);
export const UserGroupLog: Model<IUserGroupLogModel> = model<IUserGroupLogModel>('UserGroupLog', UserGroupLogSchema);
export const RoleLog: Model<IRoleLogModel> = model<IRoleLogModel>('RoleLog', RoleLogSchema);
// export const PhysicalContactLog: Model<IPhysicalContactLogModel> = model<IPhysicalContactLogModel>('PhysicalContactLog', PhysicalContactLogSchema);
// export const CorporateContactLog: Model<ICorporateContactLogModel> = model<ICorporateContactLogModel>('CorporateContactLog', CorporateContactLogSchema);
export const ContactLog: Model<IContactLogModel> = model<IContactLogModel>('ContactLog', ContactLogSchema);

export type IAnyLogModel =      IUserLogModel |
                                IUserGroupLogModel |
                                IRoleLogModel |
                                // IPhysicalContactLogModel |
                                // ICorporateContactLogModel;
                                IContactLogModel;

export type IAnyEntityModel =   IUserModel |
                                IUserGroupModel |
                                IRoleModel |
                                // IPhysicalContactModel |
                                // ICorporateContactModel;
                                IContactModel;
