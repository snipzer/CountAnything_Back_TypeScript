import {ICounterModel} from "../models/counter";
import mongoose = require("mongoose");
import {BaseRepository} from "./baseRepository";

export class CounterRepository extends BaseRepository<ICounterModel> {

    constructor(modele) {
        super(modele);
    }

    async getByDate(date:Date) {
        return await this._modele.findOne({date: date});
    }

    async post() {
        return await this._modele.create({
            date: new Date()
        });
    }
}