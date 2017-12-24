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

    // Fonction qui supprime un compteur d'un utilisateur
    async removeCounterSet(idUser: string, idCounterSet: string) {
        let isDeleted: boolean = false;
        let user = await this.getOneById(idUser);
        let counterSet = await this._counterSetRepository.getOneById(idCounterSet);
        const index = user.counterSets.indexOf(counterSet);
        user.counterSets.splice(index, 1);
        user.save();
        return this._counterSetRepository.deleteById(idCounterSet)
            .then(response => {return response;})
            .catch(error => {return error;});
    }
}