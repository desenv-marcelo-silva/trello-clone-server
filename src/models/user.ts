import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcryptjs from "bcryptjs";

import { UserDocument } from '../types/user.interface';

const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: [true, 'The e-mail is required'],
        validate: [validator.isEmail, "invalid e-mail"],
        createIndexes: { unique: true }
    },
    username: {
        type: String,
        required: [true, "The username is required"],
    },
    password: { 
        type: String,
        required: [true, "The password is required"],
        select: false
    }
},
{ timestamps: true }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error as Error)
    }
});

userSchema.methods.validatePassword = function (password: string) {
    return bcryptjs.compare(password, this.password);
};

export default model<UserDocument>('User', userSchema);