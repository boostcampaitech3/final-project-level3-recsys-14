import { Router } from "express";
import {
    getRecommendProblemsByHandle,
    getRecommendProblemsByHandles,
} from "../controllers/recommendGeneralProblemsControllers";
import {
    getRecommendRivalsByHandle,
    getRecommendRivalsByHandles,
} from "../controllers/recommendRivalsControllers";
import {
    getRivalsProblemsByHandle,
    getRivalsProblemsByHandles,
} from "../controllers/recommendRivalsProblemsControllers";
import { wrapTryCatch } from "../../helper/utils/wrapTryCatch";

const recommendRouters = Router();
const recommendProblemsRouters = Router();
const recommendRivalsRouters = Router();
const rivalsProblemsRouters = Router();

export default (router: Router) => {
    router.use("/recommend", recommendRouters);

    recommendRouters.use("/problem", recommendProblemsRouters);
    recommendRouters.use("/rival", recommendRivalsRouters);

    recommendProblemsRouters.get("/show", wrapTryCatch(getRecommendProblemsByHandle));
    recommendProblemsRouters.get("/lookup", wrapTryCatch(getRecommendProblemsByHandles));

    recommendRivalsRouters.use("/problem", rivalsProblemsRouters);
    recommendRivalsRouters.get("/show", wrapTryCatch(getRecommendRivalsByHandle))
    recommendRivalsRouters.get("/lookup", wrapTryCatch(getRecommendRivalsByHandles))

    rivalsProblemsRouters.get("/show", wrapTryCatch(getRivalsProblemsByHandle))
    rivalsProblemsRouters.get("/lookup", wrapTryCatch(getRivalsProblemsByHandles))
}

