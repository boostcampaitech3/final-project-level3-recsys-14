import { Router } from "express";
import {
    checkUser
} from "../controllers/usersControllers";
import { wrapTryCatch } from "../../helper/utils/wrapTryCatch";

const usersRouters = Router();

export default (router: Router) => {
    router.use("/user", usersRouters);
    
    usersRouters.get("/check", wrapTryCatch(checkUser))
};