import { Service } from "typedi";
import { Problems } from "../database/entityReadOnly/problems";
import { ProblemsRepository } from "../repository/problemsRepository";
import { problemsFilter } from "./filters/problemsFilters"
import { filterProperites } from "../helper/utils/filterProperties";
import config from "../config";
import { number } from "joi";


@Service()
export default class ProblemsService {
    constructor(
        private readonly usersRepository: ProblemsRepository
    ) {}

    public async getProblemById(problemId: number) {
        const { rowInfo } = await this.usersRepository.fetchRowByProblemId(Problems, problemId);
        
        const rowInfoFiltered = filterProperites<Problems>(rowInfo, problemsFilter);
        return rowInfoFiltered;
    }

    public async getProblemsByIds(problemIds: number[]) {
        let rowsInfo = []
        await Promise.all(problemIds.map(
            async problemId => {
                const { rowInfo } = await this.usersRepository.fetchRowByProblemId(Problems, problemId);
                const rowInfoFiltered = filterProperites<Problems>(rowInfo, problemsFilter);
                rowsInfo.push(rowInfoFiltered);
            }
        ));
        
        return rowsInfo;
    }
}