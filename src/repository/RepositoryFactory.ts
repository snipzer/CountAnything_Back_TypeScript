import {UserRepository} from "./UserRepository";
import {IModel} from "../models/BaseModel";
import {CounterRepository} from "./CounterRepository";
import {CounterSetRepository} from "./CounterSetRepository";

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
        this.USER = new UserRepository(this._modele.USER, this.COUNTER_SET, this.COUNTER);
        return this;
    }

}