import { Service } from "typedi";
import { EntityTarget } from "typeorm";
import { Users } from "../database/entity/users";
import { BaseRepository } from "./baseRepository";

@Service()
export class UsersRepository extends BaseRepository<Users> {
    private constructor() {
        super(Users);
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