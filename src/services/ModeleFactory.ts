import {Model} from "mongoose";
import {IUserModel} from "../models/user";

export class ModeleFactory {

    USER: Model<IUserModel> = null;
}