import {Schema} from "mongoose";
import mongoose = require("mongoose");
import * as _ from 'underscore';
import {userSchema} from "./user";
import {counterSchema} from "./counter";

export let counterSetSchema: Schema = new Schema({
    label: {type: String},
    creationDate: {type: Date, default: Date.now()},
    lastUpdated: {type: Date, default: Date.now()},
    counters: [{type: mongoose.model, soft_delete_action: null, ref: "Counter"}],
    user: {type: mongoose.model, soft_delete_action: null, ref: "User"}
});

counterSetSchema.pre("save", next => {
    function setDateDefault(date) {
        if (!date || _.isUndefined(date) || _.isNull(date))
            date = new Date();
    }
    setDateDefault(this.creationDate);
    setDateDefault(this.lastUpdated);
    next();
});