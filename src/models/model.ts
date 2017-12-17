import { Model } from "mongoose";
import {IUserModel} from "./user";

export interface IModel<T> {
    user: Model<IUserModel>;
}