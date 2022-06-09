import { Service } from "typedi";
import { RecommendRivalsProblems } from "../database/entityReadOnly/recommendRivalsProblems";
import { RecommendRivalsProblemsRepository } from "../repository/recommendRivalsProblemsRepository";
import { recommendRivalsProblemsFilter } from "./filters/recommendRivalsProblemsFilters";
import { filterProperites } from "../helper/utils/filterProperties";
import config from "../config";
import { number } from "joi";


@Service()
export default class RecommendRivalsProblemsService {
    constructor(
        private readonly recommendGeneralProblemsRepository: 
        RecommendRivalsProblemsRepository
    ) {}

    public async getRivalsProblemsByHandle(handle: string) {
        const { rowInfo } = await this.
        recommendGeneralProblemsRepository.fetchRowByHandle(
            RecommendRivalsProblems, handle
        );
        const rowInfoFiltered = filterProperites<RecommendRivalsProblems>(
            rowInfo, recommendRivalsProblemsFilter
        );
        rowInfoFiltered.rec_problems = rowInfoFiltered.rec_problems.split(",");
        return rowInfoFiltered;
    }

    public async getRivalsProblemsByHandles(handles: string[]) {
        let rowsInfo = []
         await Promise.all(handles.map(async handle => {
            const { rowInfo } = await this.
            recommendGeneralProblemsRepository.fetchRowByHandle(
                RecommendRivalsProblems, handle
            );
            const rowInfoFiltered = filterProperites<RecommendRivalsProblems>(
                rowInfo, recommendRivalsProblemsFilter
            );
            rowInfoFiltered.rec_problems = rowInfoFiltered.rec_problems.split(",");
            rowsInfo.push(rowInfoFiltered);
        }));
        
        return rowsInfo;
    }
}