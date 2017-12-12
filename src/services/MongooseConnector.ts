import mongoose = require("mongoose");
import {userSchema} from "../schemas/user";
import {IUserModel} from "../models/user";

export class MongooseConnector {
    private DOC_NAME: string;
    private HOST: string;
    private PORT: string;
    private MONGODB_CONNECTION: string;

    private static _instance: MongooseConnector = null;

    public static async getInstance(): Promise<MongooseConnector> {
        if (this._instance === null) {
            this._instance = await new MongooseConnector();
        }
        return this._instance;
    }

    private _connection: mongoose.Connection;

    private constructor() {
        mongoose.Promise = global.Promise;
        this.DOC_NAME = process.env.DB_NAME;
        this.HOST = process.env.DB_HOST;
        this.PORT = process.env.DB_PORT;
        this.MONGODB_CONNECTION = `mongodb://${this.HOST}:${this.PORT}/${this.DOC_NAME}`;
        this.createConnection().then(connection => {
            this._connection = connection;
            console.log(`Connected on mongoose document ${this.DOC_NAME} on port ${this.PORT}`);
        }).catch(err => {
            console.log(err);
        });
    }

    public getConnection(): mongoose.Connection {
        return this._connection;
    }

    private async createConnection(): Promise<mongoose.Connection> {
        return await mongoose.createConnection(this.MONGODB_CONNECTION);
    }

    public getUserModel() {
        return this._connection.model<IUserModel>("User", userSchema);
    }
}