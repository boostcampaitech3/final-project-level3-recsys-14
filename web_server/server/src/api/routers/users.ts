import { Router } from "express";
import {
    checkUser,
    getUserByHandle,
    getUsersByHandles,
    getUsersStartWithHandle,
} from "../controllers/usersControllers";
import { wrapTryCatch } from "../../helper/utils/wrapTryCatch";

const usersRouters = Router();

export default (router: Router) => {
    router.use("/user", usersRouters);
    
    usersRouters.get("/check", wrapTryCatch(checkUser));
    usersRouters.get("/show", wrapTryCatch(getUserByHandle));
    usersRouters.get("/lookup", wrapTryCatch(getUsersByHandles));
    usersRouters.get("/search", wrapTryCatch(getUsersStartWithHandle));
};