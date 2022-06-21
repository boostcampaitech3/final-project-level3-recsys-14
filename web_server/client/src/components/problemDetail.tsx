import styled from "styled-components";
import { Image } from "react-bootstrap";
import specWrapperImage from "../assets/images/spec_background_large.png";
import ItemSlide from "./itemCarousel";
import { useSelector } from "react-redux";
import { RootState } from "../modules";

import {
    bright_purple,
} from "../constants/color";
import tierColor from "../utils/useTierColor";

const ProblemItemPage = styled.div`
    position: relative;
    background: 
        linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)),
        url("${specWrapperImage}") center center / cover no-repeat;
    width: auto;
    min-width: 60%;
    max-width: 820px;
    padding: 15px;
    border-radius: 1.5rem;
    box-shadow: 
        0px 15px 35px -5px rgb(50 88 130 / 32%);
    margin: 30px 20px 60px;
    cursor: pointer;
    &:hover {
        color: #6b6eff;
    }
    @media screen and (max-width: 640px){
        width: 90%;
    }
`;

const WhiteBox = styled.div`
    display: block;
    padding: 10px;
    background-color: #ffffffea;
    border-radius: 1.5rem;
`;

const WhiteTitleBox = styled.div`
    display: inline-block;
    width: 59%;
    margin-right: 1%;
    @media screen and (max-width: 640px){
        width: 100%;
        margin-right: 0;
    }
`;

const WhiteLevelBox = styled.div`
    display: inline-block;
    width: 39%;
    height: 100%;
    margin-left: 1%;
    @media screen and (max-width: 640px){
        display: flex;
        justify-content: center;
        width: 100%;
        margin-left: 0;
    }
`;

const ProblemTitle = styled.h2`
    font-size: 1.6rem;
    text-align: center;
    margin: 10px 20px;
`;

const ProblemLink = styled.a`
    color: #595959;
    text-decoration: none;
    &:hover{
        color: ${bright_purple};
        font-weight: 600;
    }
`;

const ProblemLevel = styled.h4`
    text-align: center;
    margin: 10px 2%;    
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 1.3rem;
    /* color: #13854e; */
    /* background-color: #d6ede2; */
`;

const TagBoxWrapper = styled.div`
    display: inline-block;width: 59%;
    margin-right: 1%;
    margin-top: 10px;
    @media screen and (max-width: 640px){
        width: 100%;
        margin-left: 1%;
    }
`;

const SolvedInfoBoxWrapper = styled.div`
    display: inline-block;width: 39%;
    margin-left: 1%;
    margin-top: 10px;
    margin-bottom: 10px;
    @media screen and (max-width: 640px){
        width: 100%;
        margin-left: 0;
        
    }
`;

const TagBox = styled.div`
    display: flex;
    margin: 0px 0 10px;
    background-color:
        rgba(230, 230, 230, 0.43);
    border-radius: 1.2rem;
    padding: 0 5px;
    overflow-x: scroll;
    @media screen and (max-width: 640px){
        padding: 0 5%;
    }
`;

const TagItemWrapper = styled.div`
    font-size: 1.1rem;
    margin: 10px 15px;
`;

const SolvedInfoBox = styled.div`
    display: flex;
    justify-content: center;  
    margin-left: 1%;
    @media screen and (max-width: 640px){
        width: 100%;
        margin-top: 0;
        margin-left: 0;
    }
`;

const SolvedInfo = styled.h4`
    text-align: center;
    margin: 0 1%;
    width: 50%;
    border-radius: 1.2rem;
    padding: 4px 8px;
    font-size: 0.9rem;
    color: #3b3b3b;
    background-color: #ffeed8;
    word-break: keep-all;
`;

const ProblemDetail = ({item}:any) =>{
    const numberFormatter = Intl.NumberFormat('en-US');
    const rawLevel = item.level as number;
    let tier = "난이도 정보 없음";

    if (rawLevel > 0){
        switch(Math.floor((rawLevel - 1) / 5)){
            case 0:
                tier = "브론즈"; break;
            case 1: 
                tier = "실버";
                break;
            case 2:
                tier = "골드";
                break;
            case 3:
                tier = "플래티넘";
                break;
            case 4:
                tier = "다이아몬드";
                break;
            case 5:
                tier = "루비";
                break;
            default:
                break;
        }
        tier = tier + " " + (6 - ((rawLevel - 1) % 5 + 1));
    }
    const tagSwitch = useSelector((state : RootState) => state.tagSwitch.toggle);
    const [Color, backgroundColor] = tierColor(tier);

    return(
        <>
        <ProblemItemPage>
            <WhiteBox>
            <WhiteTitleBox>
                <ProblemTitle>
                <ProblemLink href = {`https://www.acmicpc.net/problem/${item.problem_id}`} target='_blank'>
                    {item.title}
                </ProblemLink>
                </ProblemTitle>
                
            </WhiteTitleBox>
            <WhiteLevelBox>
                <ProblemLevel style={{color : Color, backgroundColor : backgroundColor}}>
                    {tier}
                </ProblemLevel>
            </WhiteLevelBox>
            <TagBoxWrapper>
            <TagBox>
                {item.tags != null ? item.tags.split(',').map(
                    (tag : string, i : number) => 
                    <TagItemWrapper key={i}>
                        <ProblemLink href = {`https://solved.ac/problems/tags/${tag}`} target='_blank'>
                            #{tag}
                        </ProblemLink>
                    </TagItemWrapper>
                ): <TagItemWrapper>
                    태그 정보가 없습니다.
                    </TagItemWrapper>}
            </TagBox>
            </TagBoxWrapper>
            <SolvedInfoBoxWrapper>
            <SolvedInfoBox>
                <SolvedInfo>
                    {"평균 시도: " + numberFormatter.format(item.average_tries) + "회"}
                </SolvedInfo>
                <SolvedInfo>
                    {"맞힌 사람: " + numberFormatter.format(item.accepted_user_count) + "명"}
                </SolvedInfo>
            </SolvedInfoBox>
            </SolvedInfoBoxWrapper>
            </WhiteBox>
        </ProblemItemPage>
        </>
    )
}

export default ProblemDetail;
