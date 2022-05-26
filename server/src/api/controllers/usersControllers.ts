import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import UsersService from "../../services/usersService";

export const checkUser = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const usersServiceInstance = Container.get(UsersService);
    const userExisted = await usersServiceInstance.checkUserByHandle(handle);

    res.status(200).send({
        handle: userExisted.handle,
        message: `User ${userExisted.handle} exists.`,
    });
};