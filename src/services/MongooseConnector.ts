import mongoose = require("mongoose");

export class MongooseConnector {
    private DOC_NAME: string;
    private HOST: string;
    private PORT: string;
    private MONGODB_CONNECTION: string;

    private static _instance: MongooseConnector = null;

    public static getInstance(): MongooseConnector {
        if (this._instance === null) {
            this._instance = new MongooseConnector();
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
    }

    public getConnection(): mongoose.Connection {
        return this._connection;
    }

    public async createConnection(): Promise<any>{
        this._connection = await mongoose.createConnection(this.MONGODB_CONNECTION);
    }

    public logSuccessConnection(): void {
        console.log(`Connected on mongoose document ${this.DOC_NAME} on port ${this.PORT}`);
    }
}