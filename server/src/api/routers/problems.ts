import { Router } from "express";
import {
    getProblemById,
    getProblemsByIds,
} from "../controllers/problemsControllers";
import { wrapTryCatch } from "../../helper/utils/wrapTryCatch";

const problemsRouters = Router();

export default (router: Router) => {
    router.use("/problem", problemsRouters);

    problemsRouters.get("/show", wrapTryCatch(getProblemById));
    problemsRouters.get("/lookup", wrapTryCatch(getProblemsByIds));
};