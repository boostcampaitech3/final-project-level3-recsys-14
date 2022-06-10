import { Service } from "typedi";
import { EntityTarget } from "typeorm";
import { RecommendRivals } from "../database/entityReadOnly/recommendRivals";
import { BaseRepository } from "./baseRepository";

@Service()
export class RecommendRivalsRepository extends BaseRepository<RecommendRivals> {
    private constructor() {
        super(RecommendRivals);
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