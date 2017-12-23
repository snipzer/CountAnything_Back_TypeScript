import {UserRepository} from "./userRepository";
import {IModel} from "../models/model";
import {CounterRepository} from "./counterRepository";
import {CounterSetRepository} from "./counterSetRepository";

export class RepositoryFactory {

    public USER;
    public COUNTER;
    public COUNTER_SET;
    private _modele: IModel<any>;

    constructor(modele) {
        this._modele = modele;
    }

    public init() {
        this.COUNTER = new CounterRepository(this._modele.COUNTER);
        this.COUNTER_SET = new CounterSetRepository(this._modele.COUNTER_SET);
        this.USER = new UserRepository(this._modele.USER, this.COUNTER_SET);
        return this;
    }

}