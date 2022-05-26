import { Router } from "express";
import usersRouters from "./users";
import problemsRouters from "./problems";
import recommendRouters from "./recommend";


export default () => {
    const router = Router();
    
    usersRouters(router);
    problemsRouters(router);
    recommendRouters(router);

    return router;
};