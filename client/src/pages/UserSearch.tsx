/* eslint-disable */
import axios from "axios";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { UserConsumer, UserProvider } from "../context/UserContext";
import { User } from "../constants/types";
import { convertTypeAcquisitionFromJson } from "typescript";
import { API } from "../utils/axios";
import NavBar from "../components/navbar";
import UserSearchInputContainer from "../container/userSearchInputContainer";
import UserSearchFAQ from "../components/userSearchFAQ";
import { 
    algorithmType, 
    AlgorithmSlider, 
    AlgorithmSliderTrack,
    AlgorithmSlide,
    AlgorithmSlideHeader,
} from "../components/algorithmSlider";
import introImage from '../assets/images/main_large.png';
import mainBackgroundImage from '../assets/images/main_background_large.png';
import MainFooter from "../components/footer";
import { Phone } from "../constants/mediaQuery";

const SearchBlock = styled.input`
    background-color: white;
`;

const Box = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const IntroStyledDiv = styled.div`
    color: #fff;
    text-align: center;
    text-shadow: 1px 2px 8px rgb(0 0 0 / 14%);
    font-size: min(max(calc(16px + 3.6vmin), 20px), 54px);
    font-weight: 800;
    margin: 2.5rem 0;
`;

const IntroStyledSpan = styled.span`
    color: #fafafa;
    text-align: center;
    text-shadow: 1px 1px 4px rgb(0 0 0 / 14%);
    font-size: min(max(calc(10px + 1vmin), 10px), 18px);
    font-weight: 500;
`;

const IntroImageStyledDiv = styled.div`
    width: 100%;
    height: min(max(calc(240px + 10vmin), 340px), 380px);
    border: 0px;
    background: url(${introImage}) center center / contain no-repeat;
`;

const MainBackgroundStyledDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: min(calc(400px + 10vmin), 540px);
    z-index: -1;
    background: url(${mainBackgroundImage}) center center / cover no-repeat;
    -webkit-mask: 
        -webkit-gradient( linear, 0% 80%, 0% 0%, from(rgba(0, 0, 0, 0.7)), to(rgb(0, 0, 0, 1)) );
`;

const ContentContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin-bottom: 30px;
`;

const ContentInnerContainer = styled.div`
    width: 100%;
    padding: 30px 20px;
`;

const IntroTitle = styled.h2`
    display: block;
    font-weight: 800;
    font-size: 1.5em;
    letter-spacing: -0.02ch;
    margin: 1.5rem 0;
    text-align: left !important;

    @media screen and (max-width: 800px){
        text-align: center !important;
    }
`;

const IntroDescription = styled.p`
    display: block;
    font-size: 1em;
    font-weight: 400;
    margin: 1.2rem 0;
    text-align: left !important;

    @media screen and (max-width: 800px){
        text-align: center !important;
    }
`;

const BlankBox = styled.div`
    display: block;
    weight: 100%;
    height: 80px;
`;

function Usersearch() {

    const [user, setUser] = useState({userId : ''});
    const [usdata, setData] = useState({
        user : '',
        flag : false});
    let search_flag = false;

    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target;

        setUser({...user, [name]: value});
    };

    const fetchvalid = async() =>{
        try{
            // console.log(user)
            const {data} = await API.get(`/user/check?handle=${user.userId}`);
            // console.log(data, data.message);

            switch(data.message){
                case `${user.userId} exists.`:
                    // console.log(true);
                    search_flag = true;
                    break;

                default:
                    // console.log(false);
                    search_flag = false;
                    break;
            }
            setData({user : user.userId, flag : search_flag})
            /* if(data.flag){
                //<UserContext.Provider value = {data}/>
            }
            else{
                alert('Invalid user ID');
                //<UserContext.Provider value = {data}/>

            } */
        }
        catch(err){
            // console.log(err);
        }
        setUser({userId: ''});
    }
    const onInput = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            fetchvalid();            
        }
    }

    const clickSlide = (nextLink: string) => () => {
        window.open(nextLink, '_blank');
    } 

    return(
        <div> 
        <NavBar/>
        <Box>
            <MainBackgroundStyledDiv />
            <IntroStyledDiv>
                나를 위한 알고리즘 문제 추천
            </IntroStyledDiv>
            <IntroStyledSpan>
                BOJ 문제 풀이 이력과 유저 정보를 바탕으로<br/>
                개인별 풀 만한 문제와 라이벌을 추천해 드립니다.
            </IntroStyledSpan>
            <IntroImageStyledDiv />
            <UserSearchInputContainer />
            <ContentContainer>
            <AlgorithmSlider>
            <AlgorithmSliderTrack>
                {
                    algorithmType.map((algorithm) => (
                        <AlgorithmSlide 
                            key={algorithm.id + "1"}
                            onClick={
                                clickSlide( "https://solved.ac/search?query=%23" + algorithm.tag)
                            }  
                        >
                            <AlgorithmSlideHeader>
                                {algorithm.id}
                            </AlgorithmSlideHeader>
                            <img src={algorithm.image} />
                        </AlgorithmSlide>
                    ))
                }
                {
                    algorithmType.map((algorithm) => (
                        <AlgorithmSlide 
                            key={algorithm.id + "2"}
                            onClick={
                                clickSlide( "https://solved.ac/search?query=%23" + algorithm.tag)
                            }      
                        >
                            <AlgorithmSlideHeader>
                                {algorithm.id}
                            </AlgorithmSlideHeader>
                            <img src={algorithm.image} />
                        </AlgorithmSlide>
                    ))
                }
            </AlgorithmSliderTrack>
            </AlgorithmSlider>
            <ContentInnerContainer>
                <IntroTitle>
                    딥 러닝으로 당신에게 <Phone><br/></Phone>딱 맞는 문제를 찾아드려요.
                </IntroTitle>
                <IntroDescription>
                    알고리즘 문제 풀이 실력을 늘리고 싶지만 <Phone><br/></Phone>어떤 문제를 풀어야 할지 몰라서 고민되시나요?<br/>
                    <Phone><br/></Phone>
                    더 이상 문제 탐색에 시간을 투자할 필요 없이 <Phone><br/></Phone>이곳에서 나에게 맞는 문제를 골라 풀어보세요.
                </IntroDescription>
                <BlankBox></BlankBox>
                <IntroTitle>
                    나에게 동기부여가 되는 <Phone><br/></Phone>라이벌과 함께 실력을 올려보세요.
                </IntroTitle>
                <IntroDescription>
                    나와 비슷한 실력을 가진 라이벌이 <Phone><br/></Phone>누구인지 궁금하지 않으신가요?<br/>
                    <Phone><br/></Phone>
                    추천해 드리는 라이벌을 solved.ac에 등록하고 <Phone><br/></Phone>추천 문제를 풀면서 서로 경쟁해 보세요.
                </IntroDescription>
                <BlankBox></BlankBox>
                <IntroTitle>
                    자주 하는 질문을 정리했어요.
                </IntroTitle>
                <UserSearchFAQ />
            </ContentInnerContainer>
            </ContentContainer>
            <MainFooter />
        </Box>
        </div>
    );
}

export default Usersearch;
