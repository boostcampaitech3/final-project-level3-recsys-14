import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import RecommendRivalsProblemsService from "../../services/recommendRivalsProblemsService";


export const getRivalsProblemsByHandle = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const recommendRivalsProblemsService = Container.get(RecommendRivalsProblemsService);
    const rivalsProblems = await recommendRivalsProblemsService.getRivalsProblemsByHandle(handle);

    res.status(200).send(rivalsProblems);
};

export const getRivalsProblemsByHandles = async (req: Request, res: Response) => {
    const handles = (req.query.handles as string).split(",")

    const recommendRivalsProblemsService = Container.get(RecommendRivalsProblemsService);
    const rivalsProblems = await recommendRivalsProblemsService.getRivalsProblemsByHandles(handles);

    res.status(200).send(rivalsProblems);
};