import {IUserModel} from "../models/user";
import {BaseRepository} from "./baseRepository";

export class UserRepository extends BaseRepository<IUserModel> {

    constructor(modele) {
        super(modele);
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
}