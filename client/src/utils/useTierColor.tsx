import { useState, useCallback, ChangeEvent } from 'react';
import {tier_bronze, tier_silver, tier_gold, tier_pla, tier_dia, tier_ruby, tier_master,
    tier_bronze_back, tier_silver_back, tier_gold_back, tier_pla_back, tier_dia_back, tier_ruby_back, tier_master_back, tier_default, tier_default_back} from '../constants/color';

const tierColor = (value: string): any => {
    const stringToArray = value.split(" ");
    const tier = stringToArray[0];
    let Color = '';
    let backgroundColor = '';
    
    switch(tier){
        case "브론즈":
            Color = tier_bronze;
            backgroundColor = tier_bronze_back;
            break;
        case "실버":
            Color = tier_silver;
            backgroundColor = tier_silver_back;
            break;
        case "골드":
            Color = tier_gold;
            backgroundColor = tier_gold_back;

            break;
        case "플래티넘":
            Color = tier_pla;
            backgroundColor = tier_pla_back;

            break;
        case "다이아몬드":
            Color = tier_dia;
            backgroundColor = tier_dia_back;

            break;
        case "루비":
            Color = tier_ruby;
            backgroundColor = tier_ruby_back;

            break;
        case "마스터":
            Color = tier_master;
            backgroundColor = tier_master_back;

            break;
        default:
            Color = tier_default;
            backgroundColor = tier_default_back;
            break;
        }
    

    return [Color, backgroundColor];
};

export default tierColor;