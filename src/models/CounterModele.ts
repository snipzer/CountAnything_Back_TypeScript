import {Document} from "mongoose";
import {IUserModel} from "./UserModele";

export interface ICounterModel extends Document {
    date: Date,
    user: IUserModel
}