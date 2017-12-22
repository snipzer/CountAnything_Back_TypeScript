import { Schema } from "mongoose";

export let counterSchema: Schema = new Schema({
    date: Date
});

counterSchema.pre("save", next => {
    if(!this.date)
        this.date = new Date();
    next();
});