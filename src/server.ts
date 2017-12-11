import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as path from "path";
import { UserApi } from "./apis/user";
import { IndexRoute } from "./routes/index";
import { IModel } from "./models/model";
import { IUserModel } from "./models/user";
import { userSchema } from "./schemas/user";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");

export class Server {
    public app: express.Application;

    private _dbHost: string;
    private _documentName: string;
    private _mongoDbPort: string;
    private _model: IModel;
    private _router: express.Router;
    private _connection: mongoose.Connection;

    /**
     * @class Server
     * @method bootstap
     * @static
     * @returns {Server}
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor
     * @class server
     * @constructor
     */
    constructor() {
        this._dbHost = process.env.DB_HOST;
        this._documentName = process.env.DB_NAME;
        this._mongoDbPort = process.env.DB_PORT;
        this._router = express.Router();
        this._model = {user:null};
        this.app = express();
        this.config().then(isOk => {
            if(isOk) {
                this.api();
                this.routes();
                this.app.use(this._router);
            } else {
                console.log("Erreur lors du chargement de la configuration");
            }
        });
    }

    public config(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try{
                // Create connection string
                const MONGODB_CONNECTION: string = `mongodb://${this._dbHost}:${this._mongoDbPort}/${this._documentName}`;
                //add static paths
                this.app.use(express.static(path.join(__dirname, "public")));

                // Set templating engine
                this.app.set("views", path.join(__dirname, "views"));
                this.app.set("view engine", "twig");

                // configure bodyparser
                this.app.use(bodyParser.json());
                this.app.use(bodyParser.urlencoded({
                    extended: true
                }));

                // Configure cookieParser
                this.app.use(cookieParser("topSecretPhraseToParse"));

                // Configure override
                this.app.use(methodOverride());

                // Use q promise
                global.Promise = require("q").Promise;
                mongoose.Promise = global.Promise;

                // Connect to mongoose
                this._connection = mongoose.createConnection(MONGODB_CONNECTION);
                console.log(`Connected on mongoose document ${this._documentName} on port ${this._mongoDbPort}`);

                this._model.user = this._connection.model<IUserModel>("User", userSchema);

                // Catch 404 error and forward to error handler
                this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                    err.status = 404;
                    next(err);
                });

                // Error handling
                this.app.use(errorHandler());
                resolve(true);
            } catch(Exception) {
                reject(false);
            }
        });
    }

    public api(): void {
        let userApi = new UserApi(this._model.user);
        userApi.create(this._router);
    }

    public routes(): void {
        IndexRoute.create(this._router);
    }

}