import {ICounterModel} from "../models/counter";
import mongoose = require("mongoose");

export class CounterRepository {
    private _modele: mongoose.Model<ICounterModel>;

    constructor(modele) {
        this._modele = modele;
    }

    async getAll() {
        return await this._modele.find({});
    }

    async getOneById(id) {
        return await this._modele.findOne({_id: id});
    }

    async getOneByDate(date:Date) {
        return await this._modele.findOne({date: date});
    }

    async post() {
        return await this._modele.create({});
    }
}