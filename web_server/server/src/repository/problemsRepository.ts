import { Service } from "typedi";
import { EntityTarget } from "typeorm";
import { Problems } from "../database/entityReadOnly/problems";
import { BaseRepository } from "./baseRepository";

@Service()
export class ProblemsRepository extends BaseRepository<Problems> {
    private constructor() {
        super(Problems);
    }

    public async fetchRowByProblemId(
        entity: EntityTarget<unknown>,
        problem_id: number
    ): Promise<any> {
        const rowInfo = await this.repository
        .createQueryBuilder()
        .where("problem_id = :problem_id", {problem_id})
        .getOne();

        return { rowInfo };
    }
}