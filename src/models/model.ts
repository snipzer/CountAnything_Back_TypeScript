import { Model } from "mongoose";
import {IUserModel} from "./user";
import {ICounterModel} from "./counter";
import {ICounterSetModel} from "./counterSet";

export interface IModel<T> {
    USER: Model<IUserModel>;
    COUNTER: Model<ICounterModel>;
    COUNTER_SET: Model<ICounterSetModel>;
}