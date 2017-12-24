import mongoose = require('mongoose');
import * as _ from 'underscore';

export let counterSchema: mongoose.Schema = new mongoose.Schema({
    date: {type: Date, required: true}
});

counterSchema.pre("save", next => {
    if (!this.date || _.isUndefined(this.date) || _.isNull(this.date))
        this.date = new Date();
    next();
});