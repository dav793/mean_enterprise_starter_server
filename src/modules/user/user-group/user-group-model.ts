import { Document, Schema, Model, model, Types} from 'mongoose';
import { IUserGroup } from './user-group-interface';

export interface IUserGroupModel extends IUserGroup, Document {
    _id: Types.ObjectId;
}

export let UserGroupSchema: Schema = new Schema({
    label: String,
    userIds: [String],
    roleIds: [String],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const UserGroup: Model<IUserGroupModel> = model<IUserGroupModel>('UserGroup', UserGroupSchema);
