import mongoose = require('mongoose');

export class BaseRepository<T> {
    protected _modele: mongoose.Model<any>;

    constructor(modele) {
        this._modele = modele;
    }

    async getAll() {
        return await this._modele.find({});
    }

    async getOneById(id) {
        return await this._modele.findOne({_id: id});
    }

    async deleteById(id) {
        return await this._modele.remove({_id: id});
    }
}