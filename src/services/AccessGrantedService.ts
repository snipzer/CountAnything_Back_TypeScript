import { ApiToolsService } from "./ApiToolsService";
import bcrypt = require('bcrypt');
import jwt = require("jsonwebtoken");
import * as _ from 'underscore';


export class AccessGrantedService {

    static FORBIDDEN: string = "access_forbidden";
    static INVALID_CREDENTIAL:string = "invalid_credential";

    public static publicAccess(req, res, next) {
        next();
    }

    public static restrictedAccess(req, res, next) {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.API_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                res.json({error: AccessGrantedService.FORBIDDEN});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }

    public static authenticateUser(req, res, user) {
        bcrypt.compare(req.body.password, user.password, err => {
            if(!_.isNull(user)) {
                if(err) {
                    ApiToolsService.sendJsonResponse(res, {error: AccessGrantedService.INVALID_CREDENTIAL}, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR);
                }
                ApiToolsService.sendJsonResponse(res, {
                    userId: user._id,
                    token: jwt.sign({_id: user._id}, process.env.API_TOKEN_SECRET, {expiresIn: process.env.API_TOKEN_VALIDITY})
                }, ApiToolsService.STATUS.OK);
            } else {
                ApiToolsService.sendJsonResponse(res, {error: "invalid_credential"}, ApiToolsService.STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }

    public static async cryptPassword(password: string): Promise<string> {
        //noinspection TypeScriptValidateTypes
        return await bcrypt.hash(password, 10).then(hash => hash);
    }
}