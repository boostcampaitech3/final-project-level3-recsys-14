import { getRepository, EntityTarget, Repository } from "typeorm";

export class BaseRepository<entity> {
    protected readonly repository: Repository<entity>;

    constructor(entity: EntityTarget<entity>, connectionName?: string) {
        this.repository = getRepository(entity, connectionName);
    }
}