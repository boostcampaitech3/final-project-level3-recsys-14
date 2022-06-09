import { Service } from "typedi";
import { EntityTarget } from "typeorm";
import { RecommendRivalsProblems } from "../database/entityReadOnly/recommendRivalsProblems";
import { BaseRepository } from "./baseRepository";

@Service()
export class RecommendRivalsProblemsRepository 
extends BaseRepository<RecommendRivalsProblems> {
    private constructor() {
        super(RecommendRivalsProblems);
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