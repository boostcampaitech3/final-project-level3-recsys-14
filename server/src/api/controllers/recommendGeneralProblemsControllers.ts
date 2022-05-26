import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import RecommendGeneralProblemsService from "../../services/recommendGeneralProblemsService";


export const getRecommendByHandle = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const recommendGeneralProblemsServiceInstance = Container.get(RecommendGeneralProblemsService);
    const recommendProblems = await recommendGeneralProblemsServiceInstance.getRecommendByHandle(handle);

    res.status(200).send(recommendProblems);
};

export const getRecommendByHandles = async (req: Request, res: Response) => {
    const handles = (req.query.handles as string).split(",")

    const recommendGeneralProblemsServiceInstance = Container.get(RecommendGeneralProblemsService);
    const recommendProblems = await recommendGeneralProblemsServiceInstance.getRecommendByHandles(handles);

    res.status(200).send(recommendProblems);
};