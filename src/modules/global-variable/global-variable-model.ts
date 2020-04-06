import { Document, Schema, Model, model, Types} from 'mongoose';

import { IGlobalVariable } from './global-variable-interface';

export interface IGlobalVariableModel extends IGlobalVariable, Document {
    _id: Types.ObjectId;
}

export let GlobalVariableSchema: Schema = new Schema({
    name: {
        type: String
    },
    value: {
        type: Schema.Types.Mixed,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const GlobalVariable: Model<IGlobalVariableModel> = model<IGlobalVariableModel>('GlobalVariable', GlobalVariableSchema);
