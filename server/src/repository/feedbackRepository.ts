import { Service } from "typedi";
import { EntityTarget } from "typeorm";
import { Feedback } from "../database/entityWritable/feedback";
import { BaseRepository } from "./baseRepository";

@Service()
export class FeedbackRepository extends BaseRepository<Feedback> {
    private constructor() {
        super(Feedback, "writableConnection");
    }

    public async fetchRowByHandle(
        entity: EntityTarget<unknown>,
        handle: string
    ): Promise<any>{
        const rowInfo = await this.repository
        .createQueryBuilder()
        .where("handle = :handle", { handle })
        .getOne();

        return { rowInfo };
    }

    public async insertRow(
        entity: EntityTarget<unknown>,
        data: Feedback
    ): Promise<any> {
        const { generatedMaps } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values([data])
      .execute();
      
      return { generatedMaps }
    }

    public async updateRow(
        entity: EntityTarget<unknown>,
        data: Feedback
    ): Promise<any> {
        const { affected } = await this.repository
          .createQueryBuilder()
          .update(entity)
          .set({ ...data })
          .where("handle = :handle", { handle: data.handle })
          .execute();
    
        return { affected: affected! };
    }

}