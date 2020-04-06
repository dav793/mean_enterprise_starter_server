import { Document, Schema, Model, model, Types} from 'mongoose';

import {IRelationDefinition} from './relation-definition-interface';

export interface IRelationDefinitionModel extends IRelationDefinition, Document {
    _id: Types.ObjectId;
}

export let RelationDefinitionSchema: Schema = new Schema({
    description: {
        type: String
    },
    entityTypeA: {
        type: String
    },
    entityTypeB: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const RelationDefinition: Model<IRelationDefinitionModel> = model<IRelationDefinitionModel>('RelationDefinition', RelationDefinitionSchema);
