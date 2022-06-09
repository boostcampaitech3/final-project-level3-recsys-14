import { Service } from "typedi";
import { RecommendRivals } from "../database/entityReadOnly/recommendRivals";
import { RecommendRivalsRepository } from "../repository/recommendRivalsRepository";
import { recommendRivalsFilter } from "./filters/recommendRivalsFilters";
import { filterProperites } from "../helper/utils/filterProperties";
import config from "../config";
import { number } from "joi";


@Service()
export default class RecommenRivalsService {
    constructor(
        private readonly recommendRivalsRepository: 
        RecommendRivalsRepository
    ) {}

    public async getRecommendRivalsByHandle(handle: string) {
        const { rowInfo } = await this.
        recommendRivalsRepository.fetchRowByHandle(
            RecommendRivals, handle
        );
        const rowInfoFiltered = filterProperites<RecommendRivals>(
            rowInfo, recommendRivalsFilter
        );
        rowInfoFiltered.rec_rivals = rowInfoFiltered.rec_rivals.split(",");
        return rowInfoFiltered;
    }

    public async getRecommendRivalsByHandles(handles: string[]) {
        let rowsInfo = []
         await Promise.all(handles.map(async handle => {
            const { rowInfo } = await this.
            recommendRivalsRepository.fetchRowByHandle(
                RecommendRivals, handle
            );
            const rowInfoFiltered = filterProperites<RecommendRivals>(
                rowInfo, recommendRivalsFilter
            );
            rowInfoFiltered.rec_rivals = rowInfoFiltered.rec_rivals.split(",");
            rowsInfo.push(rowInfoFiltered);
        }));
        
        return rowsInfo;
    }
}