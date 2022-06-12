import { StatusCode } from "./httpStatusCodes";

export interface BaseErrorDTO {
    name: string;
    statusCode: StatusCode;
    message: string;
    isOperational?: boolean;
    stack?: string;
}

export class BaseError extends Error {
    protected statusCode: number;
    protected isOperational: boolean;

    constructor({ name, statusCode, message, isOperational }: BaseErrorDTO) {
        super();
        this.name = name || "Server Error";
        this.statusCode = statusCode || 500;
        this.message = message || "No Error Messages";
        this.isOperational = isOperational || true;
        Error.captureStackTrace(this);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class Api400Error extends BaseError {
    constructor(
        message: string,
        name = "Bad Request",
        statusCode = StatusCode.Bad_Request
    ) {
        super({ name, statusCode, message });
    }
}


export class Api401Error extends BaseError {
    constructor(
        message: string,
        name = "Unauthorized",
        statusCode = StatusCode.Unauthorized
    ) {
        super({ name, statusCode, message });
    }
}

export class Api403Error extends BaseError {
    constructor(
        message: string,
        name = "Forbidden",
        statusCode = StatusCode.Unauthorized
    ) {
        super({ name, statusCode, message });
    }
}

export class Api404Error extends BaseError {
    constructor(
        message: string,
        name = "Not Found",
        statusCode = StatusCode.Not_Found
    ) {
        super({ name, statusCode, message });
    }
}

export class Api409Error extends BaseError {
    constructor(
        message: string,
        name = "Conflict",
        statusCode = StatusCode.Conflict
    ) {
        super({ name, statusCode, message });
    }
}