import { Service } from "typedi";
import { Problems } from "../database/entity/problems";
import { ProblemsRepository } from "../repository/problemsRepository";
import config from "../config";
import { number } from "joi";


@Service()
export default class ProblemsService {
    constructor(
        private readonly usersRepository: ProblemsRepository
    ) {}

    public async getProblemById(problemId: number) {
        const { rowInfo } = await this.usersRepository.fetchRowByProblemId(Problems, problemId);
        return rowInfo;
    }

    public async getProblemByIds(problemIds: number[]) {
        let rowsInfo = []
         await Promise.all(problemIds.map(async problemId => {
            const { rowInfo } = await this.usersRepository.fetchRowByProblemId(Problems, problemId);
            rowsInfo.push(rowInfo)
        }));
        
        return rowsInfo;
    }
}