import {Document} from "mongoose";
import {ICounterModel} from "./CounterModele";
import {IUserModel} from "./UserModele";

export interface ICounterSetModel extends Document {
    label: String,
    creationDate: Date,
    lastUpdated: Date,
    counters: Array<ICounterModel>,
    user: IUserModel
}