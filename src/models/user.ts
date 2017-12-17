import { Document } from "mongoose";

export interface IUserModel extends Document {
    email: string;
    password:string;
    firstName?:string;
    lastName?:string;
    createdAt?:string;
}