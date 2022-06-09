import { Service } from "typedi";
import { Users } from "../database/entityReadOnly/users";
import { UsersRepository } from "../repository/usersRepository";
import { usersFilter } from "./filters/usersFilters";
import { filterProperites } from "../helper/utils/filterProperties";
import config from "../config";


@Service()
export default class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}

    public async checkUserByHandle(handle: string) {
        const { rowInfo } = await this.usersRepository.fetchRowByHandle(Users, handle);
        return rowInfo.handle;
    }

    public async getUserByHandle(handle: string) {
        const { rowInfo } = await this.usersRepository.fetchRowByHandle(Users, handle);
        const rowInfoFiltered = filterProperites<Users>(rowInfo, usersFilter);
        return rowInfoFiltered;
    }

    public async getUsersByHandles(handles: string[]) {
        let rowsInfo = []
        await Promise.all(handles.map(
            async handle => {
                const { rowInfo } = await this.usersRepository.fetchRowByHandle(Users, handle);
                const rowInfoFiltered = filterProperites<Users>(rowInfo, usersFilter);
                rowsInfo.push(rowInfoFiltered);
            }
        ));
        
        return rowsInfo;
    }

    public async getUsersStartWithHandle(handle: string){
        const { rowsInfo } = await this.usersRepository.fetchRowStartWithHandle(Users, handle);
        
        let usersInfo = []
        await Promise.all(rowsInfo.map(
            async rowInfo => {
                usersInfo.push({
                    handle: rowInfo.handle,
                    tier: rowInfo.tier
                });
            }
        ));
        
        return usersInfo;
    }
}