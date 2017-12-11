import {NextFunction, Request, Response} from "express";

export class BaseRoute {
    protected title: string;
    private _scripts: string[];

    constructor() {
        this.title = "Tour of Heroes";
        this._scripts = [];
    }

    /**
     * Add a JS external file to the request.
     *
     * @class BaseRoute
     * @method addScript
     * @param src {string} The src to the external JS file.
     * @return {BaseRoute} Self for chaining
     */
    public addScript(src: string): BaseRoute {
        this._scripts.push(src);
        return this;
    }

    public render(view: string, req: Request, res: Response, options?: Object) {
        res.locals.BASE_URL = "/";
        res.locals.scripts = this._scripts;
        res.locals.title = this.title;
        res.render(view, options);
    }
}