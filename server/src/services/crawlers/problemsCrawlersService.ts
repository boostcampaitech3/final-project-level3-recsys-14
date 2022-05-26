import { Request, Response, NextFunction } from "express";
import axios from 'axios';
import config from '../../config';

export const getProblemInfo = async (problemId: number) => {
    const [solvedAcRepository, bojRepository] = await Promise.all([
        axios.get(`${config.crawler.solvedAc.host}/problem/show`, {
            params: {problemId: problemId},
            headers: {'Content-Type': 'application/json'}
        }),
        axios.get(`${config.crawler.boj.host}/problem/${problemId}`, {
            headers: {'Content-Type': 'application/json'}
        }),
    ]);

    if (solvedAcRepository.status != 200) {
        throw new Error("An error occurred while getting data from solved AC.");
    }

    if (bojRepository.status != 200) {
        throw new Error("An error occurred while getting data from BOJ.")
    }

    console.log(`Successfully load information problem ${problemId}`);

    const solvedAcData = solvedAcRepository.data

    const problemInfo = {
        title: solvedAcData.titleKo,
        tags: solvedAcData.tags,
        is_solvable: solvedAcData.isSolvable,
    } 
    return problemInfo;
}