import {ICounterSetModel} from "../models/CounterSetModele";
import {BaseRepository} from "./BaseRepository";
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

    async put(id:string, label: string) {
        let counterSet = await this.getOneById(id);
        counterSet.label = label.trim();
        counterSet.save();
        return counterSet;
    }
}