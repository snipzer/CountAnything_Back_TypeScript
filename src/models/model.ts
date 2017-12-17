import { Model } from "mongoose";
import {IUserModel} from "./user";

export interface IModel<T> {
    USER: Model<IUserModel>;
}