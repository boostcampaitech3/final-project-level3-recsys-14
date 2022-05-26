import { Router } from "express";
import {
    getRecommendByHandle,
    getRecommendByHandles
} from "../controllers/recommendGeneralProblemsControllers";
import { wrapTryCatch } from "../../helper/utils/wrapTryCatch";

const recommendRouters = Router();

export default (router: Router) => {
    router.use("/recommend", recommendRouters);

    recommendRouters.get("/show", wrapTryCatch(getRecommendByHandle));
    recommendRouters.get("/lookup", wrapTryCatch(getRecommendByHandles));
};