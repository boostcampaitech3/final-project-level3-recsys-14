import { Router } from "express";
import usersRouters from "./users";
import problemsRouters from "./problems";
import recommendRouters from "./recommend";
import feedbackRouters from "./feedback";

export default () => {
    const router = Router();
    
    usersRouters(router);
    problemsRouters(router);
    recommendRouters(router);
    feedbackRouters(router);

    return router;
};