import { Request, Response, NextFunction } from "express";
import logger from "../../config/winston";

export const wrapTryCatch = function (controller) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            logger.error(error);
            const { name, statusCode, message, isOperational } = error;
            res.status(400).send({ name, statusCode, message, isOperational });
        }
    };
};