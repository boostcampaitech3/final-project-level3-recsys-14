import { Service } from "typedi";
import { RecommendGeneralProblems } from "../database/entity/recommendGeneralProblems";
import { RecommendGeneralProblemsRepository } from "../repository/recommendGeneralProblemsRepository";
import { recommendGeneralProblemsFilter } from "./filters/recommendGeneralProblemsFilters";
import { filterProperites } from "../helper/utils/filterProperties";
import config from "../config";
import { number } from "joi";


@Service()
export default class RecommendGeneralProblemsService {
    constructor(
        private readonly recommendGeneralProblemsRepository: 
        RecommendGeneralProblemsRepository
    ) {}

    public async getRecommendProblemsByHandle(handle: string) {
        const { rowInfo } = await this.
        recommendGeneralProblemsRepository.fetchRowByHandle(
            RecommendGeneralProblems, handle
        );
        const rowInfoFiltered = filterProperites<RecommendGeneralProblems>(
            rowInfo, recommendGeneralProblemsFilter
        );
        return rowInfoFiltered;
    }

    public async getRecommendProblemsByHandles(handles: string[]) {
        let rowsInfo = []
         await Promise.all(handles.map(async handle => {
            const { rowInfo } = await this.
            recommendGeneralProblemsRepository.fetchRowByHandle(
                RecommendGeneralProblems, handle
            );
            const rowInfoFiltered = filterProperites<RecommendGeneralProblems>(
                rowInfo, recommendGeneralProblemsFilter
            );
            rowsInfo.push(rowInfoFiltered);
        }));
        
        return rowsInfo;
    }
}