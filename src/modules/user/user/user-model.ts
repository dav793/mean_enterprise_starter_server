import { Document, Schema, Model, model, Types} from 'mongoose';
import { IUser } from './user-interface';

import Config from '../../../shared/lib/config';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

export interface IUserModel extends IUser, Document {
    _id: Types.ObjectId;
    salt: String;
    hash: String;
}

export let UserSchema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    secondLastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    roleIds: {
        type: [String],
        default: []
    },
    updatePassword: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    hash: String,
    salt: String
}, {
    timestamps: true
});


UserSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + Config.get('HTTP-WS').AUTH.DAYS_TO_EXPIRE);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: expiry.getTime() / 1000,
    }, Config.get('HTTP-WS').AUTH.JWT_SECRET);
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
