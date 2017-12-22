import { Document } from "mongoose";

export interface ICounterModel extends Document {
    date:Date,
}