import {Schema} from "mongoose";
import * as _ from 'underscore';
import {counterSchema} from "./CounterSchema";


export let counterSetSchema: Schema = new Schema({
    label: {type: String, required: true},
    creationDate: {type: Date, default: Date.now()},
    lastUpdated: {type: Date, default: Date.now()},
    counters: {type: [counterSchema]}
});

counterSetSchema.pre("save", next => {
    if (!this.creationDate || _.isUndefined(this.creationDate) || _.isNull(this.creationDate)) {
        this.creationDate = new Date();
    }
    this.lastUpdated = new Date();
    next();
});

// TODO probleme pour supprimer un compteur (pas d'acces à la méthode remove)
counterSetSchema.pre("remove", next => {
    if(this.counters.length > 0) {
        this.counters.forEach(counter => {
            counter.remove()
        });
    }
});