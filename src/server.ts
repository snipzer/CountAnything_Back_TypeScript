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
import {counterSchema} from "./schemas/counter"
import {IUserModel} from "./models/user";
import {ICounterModel} from "./models/counter"
import {UserRepository} from "./repository/userRepository";
import {CounterRepository} from "./repository/counterRepository"

export class Server {
    public app: express.Application;

    private _router: express.Router;
    private _connection: mongoose.Connection;
    private _model: any;
    private _userRepository: UserRepository;
    private _counterRepository: CounterRepository;

    /**
     * @class Server
     * @method bootstap
     * @static
     * @returns {Server}
     */
    public static bootstrap(): Server {
        return new Server();
    }

    // TODO Gerer l'erreur de connection à mongo
    // TODO Ajouter une factory pour les répositories
    /**
     * Constructor
     * @class server
     * @constructor
     */
    constructor() {
        this._router = express.Router();
        this.app = express();
        this._model = {USER: null, COUNTER: null};
        this._userRepository = null;
        this._counterRepository = null;
        MongooseConnector.getInstance().createConnection().then(() => {
            MongooseConnector.getInstance().logSuccessConnection();
            this._connection = MongooseConnector.getInstance().getConnection();
            this.modeles();
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

    public modeles():void {
        this._model.USER = this._connection.model<IUserModel>('User', userSchema);
        this._model.COUNTER = this._connection.model<ICounterModel>('Counter', counterSchema);
        this._userRepository = new UserRepository(this._model.USER);
        this._counterRepository = new CounterRepository(this._model.COUNTER);

        this._counterRepository.post().then(counter => console.log(counter));
    }

    public api(): void {
        let userApi = new UserApi(this._userRepository);
        userApi.create(this._router);
    }

    public routes(): void {
        IndexRoute.create(this._router);
    }

}