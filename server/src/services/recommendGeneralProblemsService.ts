import { Service } from "typedi";
import { RecommendGeneralProblems } from "../database/entity/recommendGeneralProblems";
import { RecommendGeneralProblemsRepository } from "../repository/recommendGeneralProblemsRepository";
import config from "../config";
import { number } from "joi";


@Service()
export default class RecommendGeneralProblemsService {
    constructor(
        private readonly usersRepository: RecommendGeneralProblemsRepository
    ) {}

    public async getRecommendByHandle(handle: string) {
        const { rowInfo } = await this.usersRepository.fetchRowByHandle(
            RecommendGeneralProblems, handle
        );
        return { 
            handle: rowInfo.handle, 
            recommend: rowInfo.rec_problems
        } ;
    }

    public async getRecommendByHandles(handles: string[]) {
        let rowsInfo = []
         await Promise.all(handles.map(async handle => {
            const { rowInfo } = await this.usersRepository.fetchRowByHandle(
                RecommendGeneralProblems, handle
            );
            rowsInfo.push({
                handle: rowInfo.handle,
                recommend: rowInfo.rec_problems
            })
        }));
        
        return rowsInfo;
    }
}