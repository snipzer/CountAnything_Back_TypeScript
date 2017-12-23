import {ICounterSetModel} from "../models/counterSet";
import {BaseRepository} from "./baseRepository";
import {Model} from "mongoose";

export class CounterSetRepository extends BaseRepository<ICounterSetModel> {

    constructor(modele: Model<ICounterSetModel>) {
        super(modele);
    }

    async post(label: string) {
        return await this._modele.create({
            label: label,
            counters: []
        });
    }
}