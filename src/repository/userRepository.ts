import {IUserModel} from "../models/user";
import {BaseRepository} from "./baseRepository";
import {CounterSetRepository} from "./counterSetRepository";

export class UserRepository extends BaseRepository<IUserModel> {

    private _counterSetRepository: CounterSetRepository;

    constructor(modele, counterSetRepository) {
        super(modele);
        this._counterSetRepository = counterSetRepository;
    }

    async getOneByEmail(email) {
        return await this._modele.findOne({email: email});
    }

    async post(email, password, firstName, lastName) {
        return await this._modele.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            counterSets: []
        });
    }

    async createCounterSet(id:string, label: string) {
        let user = await this.getOneById(id);
        return await this._counterSetRepository.post(label)
            .then(counterSet => {
                user.counterSets.push(counterSet);
                user.save();
                counterSet.save();
                return user;
            })
            .catch(err => {
                return err;
            });
    }
}