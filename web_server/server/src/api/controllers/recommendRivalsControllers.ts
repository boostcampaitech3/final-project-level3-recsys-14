import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import RecommendRivalsService from "../../services/recommendRivalsService";


export const getRecommendRivalsByHandle = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const recommendRivalsService = Container.get(RecommendRivalsService);
    const recommendRivals = await recommendRivalsService.getRecommendRivalsByHandle(handle);

    res.status(200).send(recommendRivals);
};

export const getRecommendRivalsByHandles = async (req: Request, res: Response) => {
    const handles = (req.query.handles as string).split(",")

    const recommendRivalsService = Container.get(RecommendRivalsService);
    const recommendRivals = await recommendRivalsService.getRecommendRivalsByHandles(handles);

    res.status(200).send(recommendRivals);
};