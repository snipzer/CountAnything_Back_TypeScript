import {IUserModel} from "../models/UserModele";
import {BaseRepository} from "./BaseRepository";
import {CounterSetRepository} from "./CounterSetRepository";
import {CounterRepository} from "./CounterRepository";

export class UserRepository extends BaseRepository<IUserModel> {

    private _counterSetRepository: CounterSetRepository;
    private _counterRepository: CounterRepository;

    constructor(modele, counterSetRepository, counterRepository) {
        super(modele);
        this._counterSetRepository = counterSetRepository;
        this._counterRepository = counterRepository;
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
            if (counterSet.label === label.trim())
                isCounterSetExists = true;
        });
        if (!isCounterSetExists) {
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
            if (counterSet._id == idCounterSet) {
                counterSet.label = label.trim();
            }
        });
        user.save();
        await this._counterSetRepository.put(idCounterSet, label);
        return user;
    }

    async addCounter(idUser: string, idCounterSet: string) {
        let user = await this.getOneById(idUser);
        let counter = await this._counterRepository.post();
        let counterSet = await this._counterSetRepository.getOneById(idCounterSet);
        user.counterSets.forEach(counterSet => {
            if (counterSet._id == idCounterSet) {
                counterSet.counters.push(counter);
            }
        });
        counterSet.counters.push(counter);
        counterSet.save();
        user.save();
        return user;
    }

    // TODO Rajouter la contrainte de temps
    async removeCounter(idUser: string, idCounterSet: string, idCounter:string) {
        let user = await this.getOneById(idUser);
        let counterSet = await this._counterSetRepository.getOneById(idCounterSet);
        let counter = await this._counterRepository.getOneById(idCounter);
        user.counterSets.forEach(userCounterSet => {
            if(userCounterSet.label == counterSet.label) {
                userCounterSet.counters.splice(userCounterSet.counters.indexOf(counter), 1);
            }
        });
        counterSet.counters.splice(counterSet.counters.indexOf(counter), 1);
        this._counterRepository.deleteById(idCounter);
        counterSet.save();
        user.save();
        return user;
    }
}