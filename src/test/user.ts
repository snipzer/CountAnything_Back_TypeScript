import { suite, test } from "mocha-typescript";
import { IUserModel } from "../models/UserModele";
import { userSchema } from "../schemas/UserSchema";
import mongoose = require("mongoose");

// TODO rendre générique la méthode before
@suite
class UserTest {
    // Store test data
    private _data;

    // Store userModel
    public static User: mongoose.Model<IUserModel>;

    public static before() {
        // Use q promise
        global.Promise = require('q').Promise;

        // Use q library for mongoose promise
        mongoose.Promise = global.Promise;

        // Connect to mongoose
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/heros";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

        // Create model
        UserTest.User = connection.model<IUserModel>("User", userSchema);
        // Import chai and use should() assertion
        let chai = require("chai");
        chai.should();
    }

    constructor() {
        this._data = {
            email: "mail@domain.tld",
            password: "password",
            firstName: "Al",
            lastName: "Batord"
        };
    }

    @test("Should create a new User")
    public Create() {
        return new UserTest.User(this._data).save().then(user=> {
            user._id.should.exist;
            user.email.should.equal(this._data.email);
            user.firstName.should.equal(this._data.firstName);
            user.lastName.should.equal(this._data.lastName);
        });
    }
}