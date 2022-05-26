import { getRepository, EntityTarget, Repository } from "typeorm";

export class BaseRepository<entity> {
    protected readonly repository: Repository<entity>;

    constructor(entity: EntityTarget<entity>) {
        this.repository = getRepository(entity);
    }
}