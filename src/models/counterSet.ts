import {Document} from "mongoose";
import {ICounterModel} from "./counter";
import {IUserModel} from "./user";

export interface ICounterSetModel extends Document {
    label: String,
    creationDate: Date,
    lastUpdated: Date,
    counters: Array<ICounterModel>,
    user: IUserModel
}