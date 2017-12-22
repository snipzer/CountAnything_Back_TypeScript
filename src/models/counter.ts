import {Document} from "mongoose";
import {IUserModel} from "./user";

export interface ICounterModel extends Document {
    date: Date,
    user: IUserModel
}