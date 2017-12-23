import {Request, Response, Router} from "express";
import {ApiToolsService} from "../services/apiToolsService";
import {AccessGrantedService} from "../services/accessGrantedService";
import {UserRepository} from "../repository/userRepository";

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
        console.log("Creating apis.");
        router.post(ApiToolsService.BASE_API_V1 + UserApi.LOGIN, AccessGrantedService.publicAccess, this.login.bind(this));
        router.post(ApiToolsService.BASE_API_V1 + UserApi.REGISTER, AccessGrantedService.publicAccess, this.register.bind(this));
        router.get(ApiToolsService.BASE_API_V1 + UserApi.USER, AccessGrantedService.publicAccess, this.getUsers.bind(this));
        router.get(ApiToolsService.BASE_API_V1 + UserApi.USER + UserApi.ID, AccessGrantedService.publicAccess, this.getUser.bind(this));
        router.post(ApiToolsService.BASE_API_V1 + UserApi.USER + UserApi.ID + UserApi.COUNTER_SET, AccessGrantedService.publicAccess, this.createCounterSet.bind(this));
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

    public createCounterSet(req: Request, res: Response) {
        this._userRepository.createCounterSet(req.params.id, req.body.label)
            .then(counterSet => ApiToolsService.sendJsonResponse(res, counterSet, ApiToolsService.STATUS.OK))
            .catch(err => ApiToolsService.sendJsonResponse(res, err, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR));
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