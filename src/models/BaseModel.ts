import { Model } from "mongoose";
import {IUserModel} from "./UserModele";
import {ICounterModel} from "./CounterModele";
import {ICounterSetModel} from "./CounterSetModele";

export interface IModel<T> {
    USER: Model<IUserModel>;
    COUNTER: Model<ICounterModel>;
    COUNTER_SET: Model<ICounterSetModel>;
}