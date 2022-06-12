import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../modules";
import specWrapperImage from "../assets/images/spec_background_large.png";
import { bright_purple } from "../constants/color";
import tierColor from "../utils/useTierColor";

const RivalItemPage = styled.div`
position: relative;
background: 
    linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)),
    url("${specWrapperImage}") center center / cover no-repeat;
    width: auto;
    min-width: 80%;
    max-width: 820px;
    padding: 15px;
    border-radius: 1.5rem;
    box-shadow: 
        0px 15px 35px -5px rgb(50 88 130 / 32%);
    margin: 0 20px;
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

const WhiteHandleBox = styled.div`
    display: inline-block;
    width: 47%;
    margin-right: 1%;
    @media screen and (max-width: 640px){
        width: 100%;
        margin-right: 0;
    }
`;

const WhiteTierBox = styled.div`
    display: inline-block;
    width: 29%;
    height: 100%;
    margin: 0 1%;
    @media screen and (max-width: 640px){
        display: flex;
        justify-content: center;
        width: 100%;
        margin-left: 0;
    }
`;

const WhiteClassBox = styled.div`
    display: inline-block;
    width: 20%;
    height: 100%;
    margin-left: 1%;
    @media screen and (max-width: 640px){
        display: flex;
        justify-content: center;
        width: 100%;
        margin-left: 0;
    }
`;

const RivalHandle = styled.h2`
    font-size: 1.6rem;
    text-align: center;
    margin: 10px 20px;
`;

const RivalTier = styled.h4`
    text-align: center;
    margin: 10px 1%;    
    border-radius: 100px;
    padding: 4px 8px;
    font-size: 1.3rem;
    /* color: #13854e; */
    /* background-color: #d6ede2; */
    @media screen and (max-width: 640px){
        width: 70%;
    }
`;

const RivalClass = styled.h4`
    text-align: center;
    margin: 10px 1%;    
    border-radius: 100px;
    padding: 4px 8px;
    font-size: 1.3rem;
    color: #13854e;
    background-color: #d6ede2;
    @media screen and (max-width: 640px){
        width: 70%;
    }
`;

const RivalLink = styled.a`
    color: #595959;
    text-decoration: none;
    &:hover{
        color: ${bright_purple};
        font-weight: 600;
    }
`;


const RivalInfoBoxWrapper = styled.div`
    display: inline-block;
    width: 49%;
    @media screen and (max-width: 640px){
        width: 100%;
    }
`;

const RivalInfoLeftBoxWrapper = styled(RivalInfoBoxWrapper)`
    margin: 10px 1% 0px 0;
`;

const RivalInfoRightBoxWrapper = styled(RivalInfoBoxWrapper)`
    margin: 10px 0 0px 1%;
`;

const RivalInfoBox = styled.div`
    width: 100%;
    justify-content: center; 
    display: flex;
`;

const RivalInfo = styled.h4`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 3% 0%;
    width: 49%;
    border-radius: 1.2rem;
    padding: 4px 8px;
    font-size: 0.9rem;
    color: #3b3b3b;
    background-color: #ffeed8;
    word-break: keep-all;
`;

const RivalLeftInfo = styled(RivalInfo)`
    margin-left: 0;
    margin-right: 1%;
`;

const RivalRightInfo = styled(RivalInfo)`
    margin-right: 0;
    margin-left: 1%;
`;

const RivalDetail = ({rival}:any) =>{
    // const tagSwitch = useSelector((state : RootState) => state.tagSwitch.toggle);

    const numberFormatter = Intl.NumberFormat('en-US');

    const rawTier = rival.tier as number;
    let tier = "난이도 정보 없음";

    if (rawTier > 0){
        switch(Math.floor((rawTier - 1) / 5)){
            case 0:
                tier = "브론즈"; 
                break;
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
                tier = "마스터"
                break;
        } 
        if (tier != "마스터"){
            tier = tier + " " + (6 - ((rawTier - 1) % 5 + 1));
        }
    }
    const [Color, backgroundColor] = tierColor(tier);
    return(
        <>
        <RivalItemPage>
            <WhiteBox>
            <WhiteHandleBox>
                <RivalHandle>
                    <RivalLink href = {`https://solved.ac/profile/${rival.handle}`} target='_blank'>
                    {rival.handle}
                    </RivalLink>
                </RivalHandle>
            </WhiteHandleBox>
            <WhiteTierBox>
                <RivalTier style={{color : Color, backgroundColor : backgroundColor}}>
                    {tier}
                </RivalTier>
            </WhiteTierBox>
            <WhiteClassBox>
                <RivalClass>
                      Class {rival.user_class}
                </RivalClass>
            </WhiteClassBox>
            <RivalInfoLeftBoxWrapper>
            <RivalInfoBox>
                <RivalLeftInfo>
                    해결한 문제 수: {numberFormatter.format(rival.solved_count)}
                </RivalLeftInfo>
                <RivalRightInfo>
                    레이팅: {numberFormatter.format(rival.rating)}
                </RivalRightInfo>
            </RivalInfoBox>
            </RivalInfoLeftBoxWrapper>
            <RivalInfoRightBoxWrapper>
            <RivalInfoBox>
                <RivalLeftInfo>
                    경험치 : {numberFormatter.format(rival.exp)}
                </RivalLeftInfo>
                <RivalRightInfo>
                    랭크 : {numberFormatter.format(rival.rank)}
                </RivalRightInfo>
            {/* {tagSwitch && item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)} */}
            </RivalInfoBox>
            </RivalInfoRightBoxWrapper>
            </WhiteBox>
        </RivalItemPage>
        </>
    )
}

export default RivalDetail;
