import {Schema} from "mongoose";
import mongoose = require('mongoose');
import * as _ from 'underscore';
import {userSchema} from "./user";

export let counterSchema: Schema = new Schema({
    date: {type: Date, required: true},
    user: {type: mongoose.Schema, soft_delete_action: null, ref: userSchema}
});

counterSchema.pre("save", next => {
    if(!this.date || _.isUndefined(this.date) || _.isNull(this.date))
        this.date = new Date();
    next();
});