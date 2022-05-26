import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import ProblemsService from "../../services/problemsService";

export const getProblemById = async (req: Request, res: Response) => {
    const problemId = req.query.problemId as unknown as number;

    const problemsServiceInstance = Container.get(ProblemsService);
    const problemInfo = await problemsServiceInstance.getProblemById(problemId);

    res.status(200).send(problemInfo);
};

export const getProblemByIds = async (req: Request, res: Response) => {
    const problem_ids = (req.query.problemIds as string).split(",").map(
        element => Number(element)
    );

    const problemsServiceInstance = Container.get(ProblemsService);
    const problemsInfo = await problemsServiceInstance.getProblemByIds(problem_ids);

    res.status(200).send(problemsInfo);
};