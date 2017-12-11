import { Schema } from "mongoose";

export let userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    createdAt: Date
});

userSchema.pre("save", next => {
    if(!this.createdAt)
        this.createdAt = new Date();
    next();
});