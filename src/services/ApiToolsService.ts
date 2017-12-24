
export class ApiToolsService {
    static STATUS: any = {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        INTERNAL_SERVER_ERROR: 500
    };

    static BASE_API_V1:string = "/api/v1/";

    public static sendJsonResponse(res: any, thing:any, statusCode:number): void {
        res.status(statusCode);
        res.json(thing);
    }
}