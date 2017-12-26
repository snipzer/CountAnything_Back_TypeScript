import {IUserModel} from "../models/UserModele";
import {BaseRepository} from "./BaseRepository";
import {CounterSetRepository} from "./CounterSetRepository";

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
            email: email.trim(),
            password: password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            counterSets: []
        });
    }

    async createCounterSet(id: string, label: string) {
        let user = await this.getOneById(id);
        let isCounterSetExists: boolean = false;
        user.counterSets.forEach(counterSet => {
            if(counterSet.label === label.trim())
                isCounterSetExists = true;
        });
        if(!isCounterSetExists) {
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
        } else {
            return {error: "error_counterSet_already_exists"};
        }
    }

    async removeCounterSet(idUser: string, idCounterSet: string) {
        let user = await this.getOneById(idUser);
        let counterSet = await this._counterSetRepository.getOneById(idCounterSet);
        const index = user.counterSets.indexOf(counterSet);
        user.counterSets.splice(index, 1);
        user.save();
        return await this._counterSetRepository.deleteById(idCounterSet)
            .then(response => {
                return response;
            })
            .catch(error => {
                return error;
            });
    }

    async updateCounterSet(idUser: string, idCounterSet: string, label: string) {
        let user = await this.getOneById(idUser);
        user.counterSets.forEach(counterSet => {
            if(counterSet._id == idCounterSet) {
                counterSet.label = label.trim();
            }
        });
        user.save();
        await this._counterSetRepository.put(idCounterSet, label);
        return user;
    }
}