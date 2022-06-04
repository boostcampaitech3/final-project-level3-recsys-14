import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import UsersService from "../../services/usersService";

export const checkUser = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const usersServiceInstance = Container.get(UsersService);
    const userHandle = await usersServiceInstance.checkUserByHandle(handle);

    res.status(200).send({
        handle: userHandle,
        message: `User ${userHandle} exists.`,
    });
};

export const getUserByHandle = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const usersServiceInstance = Container.get(UsersService);
    const userInfo = await usersServiceInstance.getUserByHandle(handle);

    res.status(200).send(userInfo);
}

export const getUsersByHandles = async (req: Request, res: Response) => {
    const handles = (req.query.handles as string).split(",");

    const usersServiceInstance = Container.get(UsersService);
    const userInfo = await usersServiceInstance.getUsersByHandles(handles);

    res.status(200).send(userInfo);
}

export const getUsersStartWithHandle = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const usersServiceInstance = Container.get(UsersService);
    const usersInfo = await usersServiceInstance.getUsersStartWithHandle(handle);

    res.status(200).send(usersInfo);
}