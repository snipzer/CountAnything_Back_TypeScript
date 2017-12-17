import {IUserModel} from "../models/user";
import {ModeleFactory} from "./ModeleFactory";
import * as _ from 'underscore';

export class LoggerService {

    static PATH_TO_USER_FILE: string;
    static MODELE_FACTORY: ModeleFactory;

    public static loggerAction: Object = {
        WARNING: "warning",
        ERROR: "error"
    };

    private static _instance: LoggerService;

    public static getInstance(): LoggerService {
        if(_.isNull(LoggerService._instance) || typeof LoggerService._instance == "undefined")
            LoggerService._instance = new LoggerService();
        return LoggerService._instance;
    };

    private constructor() {}

    // TODO MODELE FACTORY
    public LOG(msg:string, line:number, type?:number) {
        const action = type || 0;
        switch(action) {
            case 0:
                console.log("Console.log only");
                break;
            case 1:
                console.log("Console.log + writeIntoFile");
                break;
            case 2:
                console.log("Console.log + writeIntoBdd");
                break;
            default:
                console.log("Console.log only");
                break;
        }

    }

    private static writeIntoFile() {}

    private static writeIntoBdd() {
        this.MODELE_FACTORY.USER.create({});
    }

}