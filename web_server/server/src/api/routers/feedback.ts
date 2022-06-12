import { Router } from "express";
import {
    checkFeedback,
    updateFeedback,
    createFeedback,
} from "../controllers/feedbackControllers";
import { wrapTryCatch } from "../../helper/utils/wrapTryCatch";

const feedbackRouters = Router();

export default (router: Router) => {
    router.use("/feedback", feedbackRouters);
    
    feedbackRouters.get("/check", wrapTryCatch(checkFeedback));
    feedbackRouters.post("/send", wrapTryCatch(createFeedback));
};