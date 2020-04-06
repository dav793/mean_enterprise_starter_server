import { Document, Schema, Model, model, Types} from 'mongoose';

import {IRelationInstance} from './relation-instance-interface';

export interface IRelationInstanceModel extends IRelationInstance, Document {
    _id: Types.ObjectId;
}

export let RelationInstanceSchema: Schema = new Schema({
    relationDefinitionId: {
        type: String
    },
    entityAId: {
        type: String
    },
    entityBId: {
        type: String
    },
    userId: {
        type: String
    },
    isValid: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const RelationInstance: Model<IRelationInstanceModel> = model<IRelationInstanceModel>('RelationInstance', RelationInstanceSchema);
