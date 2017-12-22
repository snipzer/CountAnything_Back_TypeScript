import {ICounterSetModel} from "../models/counterSet";
import mongoose = require("mongoose");

export class CounterSetRepository {
    private _modele: mongoose.Model<ICounterSetModel>;

    constructor(modele) {
        this._modele = modele;
    }

    async getAll() {
        return await this._modele.find({});
    }

    async getOneById(id) {
        return await this._modele.findOne({_id: id});
    }


    async post() {
        return await this._modele.create({
            date: new Date()
        });
    }
}