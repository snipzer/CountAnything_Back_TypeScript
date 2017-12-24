import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./Route";

export class IndexRoute extends BaseRoute {

    constructor() {
        super();
    }

    public static create(router: Router) {
        console.log("Creating the index route.");
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | Tour of Heroes";
        let options: Object = {
            message: "Welcome to the Tour of Heroes"
        };
        this.render("index", req, res, options);
    }
}