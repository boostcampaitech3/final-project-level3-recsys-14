import { Service } from "typedi";
import { Users } from "../database/entity/users";
import { UsersRepository } from "../repository/usersRepository";
import config from "../config";


@Service()
export default class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}

    public async checkUserByHandle(handle: string) {
        const { rowInfo } = await this.usersRepository.fetchRowByHandle(Users, handle);
        return rowInfo;
    }
}