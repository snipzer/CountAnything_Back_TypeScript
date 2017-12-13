import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as path from "path";
import {UserApi} from "./apis/user";
import {IndexRoute} from "./routes/index";
import {IModel} from "./models/model";
import {MongooseConnector} from "./services/MongooseConnector";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import {userSchema} from "./schemas/user";
import {IUserModel} from "./models/user";


export class Server {
    public app: express.Application;

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
        this._router = express.Router();
        this._model = {user: null};
        this.app = express();
        MongooseConnector.getInstance().createConnection().then(() => {
            MongooseConnector.getInstance().logSuccessConnection();
            this._connection = MongooseConnector.getInstance().getConnection();
            this._model.user = this._connection.model<IUserModel>("User", userSchema);
            this.config().then(isOk => {
                if (isOk) {
                    this.api();
                    this.routes();
                    this.app.use(this._router);
                } else {
                    console.log("Erreur lors du chargement de la configuration");
                }
            }).catch(err => console.log(err));
        });
    }

    public config(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {

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

                // Catch 404 error and forward to error handler
                this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                    err.status = 404;
                    next(err);
                });

                // Error handling
                this.app.use(errorHandler());
                resolve(true);
            } catch (Exception) {
                reject(Exception);
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