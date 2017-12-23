import { Schema } from "mongoose";
import {counterSetSchema} from "./counterSet";
import * as _ from "underscore";

export let userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    createdAt: Date,
    lastUpdated: Date,
    counterSets: {type: [counterSetSchema]}
});

userSchema.pre("save", next => {
    if(!this.createdAt || _.isUndefined(this.creationDate) || _.isNull(this.creationDate))
        this.createdAt = new Date();
    this.lastUpdated = new Date();
    next();
});