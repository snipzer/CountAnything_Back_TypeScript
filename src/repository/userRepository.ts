import {IUserModel} from "../models/user";
import mongoose = require("mongoose");

export class UserRepository{
    private _modele: mongoose.Model<IUserModel>;

    constructor(modele) {
        this._modele = modele;
    }

    async getAll() {
        return await this._modele.find({});
    }

    async getOneById(id) {
        return await this._modele.findOne({_id: id});
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
        })
    }
}