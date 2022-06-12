import { Service } from "typedi";
import { Feedback } from "../database/entityWritable/feedback";
import { FeedbackRepository } from "../repository/feedbackRepository";
import config from "../config";

@Service()
export default class FeedbackService {
    constructor(
        private readonly feedbackRepository: FeedbackRepository
    ) {}

    public async checkFeedbackByHandle(handle: string) {
        const { rowInfo } = await this.feedbackRepository.fetchRowByHandle(Feedback, handle);
        return rowInfo.handle;
    }

    public async insertFeedback(data: Feedback) {
        const { generatedMaps } = await this.feedbackRepository.insertRow(Feedback, data);
        return { newFeedback: generatedMaps[0] };
    }

    public async updateFeedback(data: Feedback) {
        const { affected } = await this.feedbackRepository.updateRow(Feedback, data);
        return { affected };
    }   
}
