import { Document, Schema, Model, model, Types} from 'mongoose';
import { IRole } from './role-interface';

export interface IRoleModel extends IRole, Document {
    _id: Types.ObjectId;
}

export let PermissionSchema: Schema = new Schema({
    action: String,
    level: Number
});

export let ResourcePermissionSchema: Schema = new Schema({
    name: String,
    permissions: [PermissionSchema]
});

export let RoleSchema: Schema = new Schema({
    name: String,
    resources: [ResourcePermissionSchema],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Role: Model<IRoleModel> = model<IRoleModel>('Role', RoleSchema);

export const DefaultRoleName = 'regular';
