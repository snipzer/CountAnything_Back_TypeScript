import {Request, Response, Router} from "express";
import {ApiToolsService} from "../services/ApiToolsService";
import {AccessGrantedService} from "../services/AccessGrantedService";
import {UserRepository} from "../repository/UserRepository";

// TODO VERIFIER LES PARAMETRES D'ENTRER DE CHAQUES METHODES
export class UserApi {

    static LOGIN: string = "login";
    static REGISTER: string = "register";
    static USER: string = "user/";
    static ID: string = ":id";
    static COUNTER_SET: string = "/counterSet";
    private _userRepository: UserRepository;

    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    public create(router: Router) {
        console.log("Creating user's api.");
        router.post(ApiToolsService.BASE_API_V1 + "login", AccessGrantedService.publicAccess, this.login.bind(this));
        router.post(ApiToolsService.BASE_API_V1 + "register", AccessGrantedService.publicAccess, this.register.bind(this));
        router.get(ApiToolsService.BASE_API_V1 + "user", AccessGrantedService.publicAccess, this.getUsers.bind(this));
        router.get(ApiToolsService.BASE_API_V1 + "user/:id", AccessGrantedService.publicAccess, this.getUser.bind(this));
        router.post(ApiToolsService.BASE_API_V1 + "user/:id/counterSet", AccessGrantedService.publicAccess, this.createCounterSet.bind(this));
        router.get(ApiToolsService.BASE_API_V1 + "user/:idUser/counterSet/:idCounterSet/remove", AccessGrantedService.publicAccess, this.removeCounterSet.bind(this));
    }

    public getUsers(req: Request, res: Response) {
        this._userRepository.getAll()
            .then(users => ApiToolsService.sendJsonResponse(res, users, ApiToolsService.STATUS.OK))
            .catch(err => ApiToolsService.sendJsonResponse(res, err, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
    }

    public getUser(req: Request, res: Response) {
        this._userRepository.getOneById(req.params.id)
            .then(user => ApiToolsService.sendJsonResponse(res, user, ApiToolsService.STATUS.OK))
            .catch(err => ApiToolsService.sendJsonResponse(res, err, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
    }

    // TODO empecher la création de deux counter avec un label identique
    public createCounterSet(req: Request, res: Response) {
        this._userRepository.createCounterSet(req.params.id, req.body.label)
            .then(counterSet => ApiToolsService.sendJsonResponse(res, counterSet, ApiToolsService.STATUS.OK))
            .catch(err => ApiToolsService.sendJsonResponse(res, err, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
    }

    public removeCounterSet(req: Request, res: Response) {
        this._userRepository.removeCounterSet(req.params.idUser, req.params.idCounterSet)
            .then(response => ApiToolsService.sendJsonResponse(res, response, ApiToolsService.STATUS.OK))
            .catch(error => ApiToolsService.sendJsonResponse(res, error, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
    }

    public login(req: Request, res: Response) {
        this._userRepository.getOneByEmail(req.body.email)
            .then(user => AccessGrantedService.authenticateUser(req, res, user))
            .catch(err => ApiToolsService.sendJsonResponse(res, err, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
    }

    public register(req: Request, res: Response) {
        AccessGrantedService.cryptPassword(req.body.password).then(hashedPassword => {
            this._userRepository.post(req.body.email, hashedPassword, req.body.firstName, req.body.lastName)
                .then(user => ApiToolsService.sendJsonResponse(res, user, ApiToolsService.STATUS.OK))
                .catch(err => ApiToolsService.sendJsonResponse(res, err, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
        });
    }
}