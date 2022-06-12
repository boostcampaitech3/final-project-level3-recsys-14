import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import ProblemsService from "../../services/problemsService";

export const getProblemById = async (req: Request, res: Response) => {
    const problemId = req.query.problemId as unknown as number;

    const problemsService = Container.get(ProblemsService);
    const problemInfo = await problemsService.getProblemById(problemId);

    res.status(200).send(problemInfo);
};

export const getProblemsByIds = async (req: Request, res: Response) => {
    const problem_ids = (req.query.problemIds as string).split(",").map(
        element => Number(element)
    );

    const problemsService = Container.get(ProblemsService);
    const problemsInfo = await problemsService.getProblemsByIds(problem_ids);

    res.status(200).send(problemsInfo);
};