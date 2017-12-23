import {ICounterSetModel} from "../models/counterSet";
import {BaseRepository} from "./baseRepository";

export class CounterSetRepository extends BaseRepository<ICounterSetModel> {

    constructor(modele) {
        super(modele);
    }

    async post(label) {
        return await this._modele.create({
            label: label,
            counters: []
        });
    }
}