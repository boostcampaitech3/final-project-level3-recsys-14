import { Service } from "typedi";
import { EntityTarget } from "typeorm";
import { RecommendGeneralProblems } from "../database/entityReadOnly/recommendGeneralProblems";
import { BaseRepository } from "./baseRepository";

@Service()
export class RecommendGeneralProblemsRepository extends BaseRepository<RecommendGeneralProblems> {
    private constructor() {
        super(RecommendGeneralProblems);
    }

    public async fetchRowByHandle(
        entity: EntityTarget<unknown>,
        handle: string
    ): Promise<any> {
        const rowInfo = await this.repository
        .createQueryBuilder()
        .where("handle = :handle", {handle})
        .getOne();

        return { rowInfo };
    }
}