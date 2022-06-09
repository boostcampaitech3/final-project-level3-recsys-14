import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import FeedbackService from "../../services/feedbackService";

export const checkFeedback = async (req: Request, res: Response) => {
    const handle = req.query.handle as string;

    const feedbackService = Container.get(FeedbackService);
    const userHandle = await feedbackService.checkFeedbackByHandle(handle);

    res.status(200).send({
        handle: userHandle,
        message: `Feedback by ${userHandle} exists.`,
    });
};

export const updateFeedback = async (req: Request, res: Response) => {
    const handle = req.body.handle as string;

    const feedbackService = Container.get(FeedbackService);
    const { affected }= await feedbackService.updateFeedback(req.body);
  
    res.status(200).send({ affected: affected, message: `Feedback by ${handle} updated.`});
  };

  export const createFeedback = async (req: Request, res: Response) => {
    const handle = req.body.handle as string;

    const feedbackService = Container.get(FeedbackService);

    try {
        const userHandle = await feedbackService.checkFeedbackByHandle(handle);
        updateFeedback(req, res);
    } catch { 
        const { newFeedback }= await feedbackService.insertFeedback(req.body);
        res.status(200).send({ newFeedback: newFeedback, message: `Feedback by ${handle} created.`});
    }
  };