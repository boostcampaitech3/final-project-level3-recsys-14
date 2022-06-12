import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import RecommendGeneralProblemsService from "../../services/recommendGeneralProblemsService";


export const getRecommendProblemsByHandle = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const recommendGeneralProblemsService = Container.get(RecommendGeneralProblemsService);
    const recommendProblems = await recommendGeneralProblemsService.getRecommendProblemsByHandle(handle);

    res.status(200).send(recommendProblems);
};

export const getRecommendProblemsByHandles = async (req: Request, res: Response) => {
    const handles = (req.query.handles as string).split(",")

    const recommendGeneralProblemsService = Container.get(RecommendGeneralProblemsService);
    const recommendProblems = await recommendGeneralProblemsService.getRecommendProblemsByHandles(handles);

    res.status(200).send(recommendProblems);
};