import { Model } from "mongoose";
import {IUserModel} from "./user";
import {ICounterModel} from "./counter";

export interface IModel<T> {
    USER: Model<IUserModel>;
    COUNTER: Model<ICounterModel>;
}