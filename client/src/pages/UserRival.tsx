/* eslint-disable */
import React, { useCallback, useEffect, useState } from "react";

import styled, {css} from "styled-components";
import {ProblemDetail, Rival, RivalDetail} from '../components'
import NavBar from "../components/navbar";
import MainFooter from "../components/footer";
import { useLocation, useParams } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import { API } from "../utils/axios";
import { useNavigate } from "react-router-dom";

import { search } from "../modules/userSearchInput";
import { toggleSwitch } from "../modules/tagSwitch";

import { RootState } from "../modules";
import RivalProblem from "../components/rivalProblem";
import rivalBackgroundImage from "../assets/images/rival_background_large.png";
import rivalRecImage from "../assets/images/rival_rec_large.png";
import RivalRecFAQ from "../components/rivalRecFAQ";
import { initialRival } from "../modules/rivalItem";
import { initialRivalProblem } from "../modules/rivalProblemItem";
import { autoUserInitial } from "../modules/autoSearch";
import RatingStar from "../components/RatingStar";
import svgIcon from "../components/svgIcon";
import {
    light_purple
} from "../constants/color";
import { Phone } from "../constants/mediaQuery";

const RivalIntroBox = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const RivalBackgroundStyledDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: min(calc(400px + 10vmin), 540px);
    z-index: -1;
    background: url(${rivalBackgroundImage}) center center / cover no-repeat;
    -webkit-mask: 
        -webkit-gradient( linear, 0% 80%, 0% 0%, from(rgba(0, 0, 0, 0.8)), to(rgb(0, 0, 0, 1)) );
`;

const RivalIntroStyledDiv = styled.div`
    color: #fff;
    text-align: center;
    text-shadow:
        1px 1px 14px rgb(0 0 0 / 14%), 
        2px 2px 28px rgb(0 0 0 / 28%);
    font-size: min(max(calc(16px + 3.6vmin), 20px), 54px);
    font-weight: 800;
    margin: 2.5rem 0;
`;

const RivalIntroImage = styled.div`
    width: 100%;
    height: min(max(calc(240px + 10vmin), 340px), 380px);
    border: 0px;
    background: url(${rivalRecImage}) center center / contain no-repeat;
`;

const RivalIntroStyledSpan = styled.span`
    color: #6aa273;
    text-align: center;
    font-size: min(max(calc(10px + 1vmin), 10px), 18px);
    font-weight: 500;
    text-shadow: 
        -1px -1px 4px rgb(237 252 161 / 70%),
        1px 1px 6px rgb(238 252 162 / 80%), 
        2px 2px 10px rgb(237 252 162 / 65%);
`;

const SliderWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 1200px;
    margin: auto;
`;

const RivalDetailWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    max-width: 1200px;
`;

const ContentContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 30px auto;
`;

const ContentInnerContainer = styled.div`
    width: 100%;
    padding: 0px 20px;
`;

const SectionTitle = styled.h2`
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

const MyProfileTitle = styled.h4`
    display: flex;
    text-align: center;
    color: #323232;
    font-weight: 600;
    font-size: 1.5rem;
    margin: 10px 0;
`;

const RatingTitle = styled.h2`
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

const RivalDescription = styled.div`
    display: block;
    font-size: 1em;
    font-weight: 400;
    margin: 1.2rem 0;
    text-align: left !important;

    @media screen and (max-width: 800px){
        text-align: center !important;
    }
`;


const LinkSvgIcon = styled(svgIcon)` 
    width: min(max(calc(10px + 1vmin), 10px), 18px); 
    height: min(max(calc(10px + 1vmin), 10px), 18px);
    position: relative;
    left: 6px;
    stroke: ${light_purple};
    fill: ${light_purple};
    cursor: pointer;
`;

const LinkSvgIconWrapper = styled.div`
    display: inline-block;
`;

const BlankBox = styled.div`
    display: block;
    weight: 100%;
    height: 50px;
`;

function Userrival() {
    const [profile, setProfile] = useState({});

    const params = useParams();
    // console.log(params);

    const location = useLocation();

    const dispatch = useDispatch();
    const userHandleDispatch = useCallback((userHandle : string | undefined)=> dispatch(search(userHandle)), [dispatch])
    const onTagSwitch = useCallback(() => dispatch(toggleSwitch()), [dispatch]);
    const initialUserRival = useCallback(()=>dispatch(initialRival()), [dispatch]);
    const initialUserRivalProblem = useCallback(()=>dispatch(initialRivalProblem()), [dispatch]);
    const autoSearchInitialDispatch = useCallback(() => dispatch(autoUserInitial()), [dispatch]);


    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const rivalItem = useSelector((state : RootState) => state.rivalItem)
    const rivalProblem = useSelector((state:RootState) => state.rivalProblemItem)
    const tagSwitch = useSelector((state:RootState) => state.tagSwitch.toggle);

    // console.log(userHandle);

    let navigate = useNavigate();

    const fetchMyProfile = async() =>{
        try{
            const {data} = await API.get(`/user/show?handle=${params.userHandle}`)
            setProfile(data)
        }
        catch(e){
            // console.log(e);
        }
    }

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${params.userHandle}`);
            fetchMyProfile();
            // console.log(data);
        }
        catch(e){
            // console.error(e);
            alert("Wrong User !");
            navigate('/');
        }
    }
    useEffect(()=>{
        fetchUserCheck();
        userHandleDispatch(params.userHandle);
        initialUserRival();
        initialUserRivalProblem();
        autoSearchInitialDispatch();
    }, [params]);

    useEffect(()=>{
        if(tagSwitch == true){
            onTagSwitch();
        }
    }, []);

    return(
        <div>
            <NavBar pathname = {location.pathname}/>
            <RivalIntroBox>
                <RivalBackgroundStyledDiv />
                <RivalIntroStyledDiv>
                    지피지기면 백전불태.<br/>
                    너의 실력이 곧 나의 실력.<br/>
                </RivalIntroStyledDiv>
                <RivalIntroStyledSpan>
                    {userHandle} 님과 비슷한 실력을 가진 라이벌을 추천해 드릴게요.<br/>
                    그리고 라이벌이 풀었지만 내가 풀지 않았던 문제도 알려드려요. <br/>
                </RivalIntroStyledSpan>
                <RivalIntroImage/>
                <MyProfileTitle>현재 {userHandle} 님의 <Phone><br/></Phone>데이터입니다.</MyProfileTitle>
                <RivalDetailWrapper>
                    <RivalDetail rival = {profile} />
                </RivalDetailWrapper>
                <BlankBox/>
                <BlankBox/>
                </RivalIntroBox>
                <SliderWrap>
                    <Rival />
                    {rivalItem.toggle && <RivalDetail rival = {rivalItem.rival} />}
                </SliderWrap>
                <BlankBox/>
                <BlankBox/>
                <SliderWrap>
                    <RivalProblem />
                    {rivalProblem.toggle && tagSwitch && <ProblemDetail item = {rivalProblem.item}/>}
                </SliderWrap>
                <ContentContainer>
                    <ContentInnerContainer>
                    <BlankBox />
                    <SectionTitle>
                        나의 실력을 기반으로 <Phone><br/></Phone>문제를 추천해 드릴까요?
                    </SectionTitle>
                    <RivalDescription>
                        라이벌 기반으로 추천된 문제에서 <Phone><br/></Phone>만족스러운 문제를 찾지 못하셨나요?<br/>
                        <Phone><br/></Phone>
                        그러면 나의 풀이 이력을 바탕으로 <Phone><br/></Phone>추천된 문제를 참고해보세요.
                        <LinkSvgIconWrapper>
                            <LinkSvgIcon 
                                onClick={() => { navigate(`/user/${userHandle}`)}}
                                className="searchicon"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                viewBox="0 0 36 36">
                                <path d="M 32.2664 12.9024 l -8.8992 -8.8992 c -0.8064 -0.8064 -2.1888 -0.8064 -2.9952 0 s -0.8064 2.1888 0 2.9952 l 5.2416 5.2704 h -19.3824 c -1.1808 0 -2.1312 0.9504 -2.1312 2.1312 s 0.9504 2.1312 2.1312 2.1312 h 19.4112 l -5.2704 5.2416 c -0.8064 0.8064 -0.8064 2.1888 0 2.9952 c 0.432 0.432 0.9792 0.6336 1.5264 0.6336 s 1.0944 -0.2016 1.5264 -0.6336 l 8.8416 -8.8416 c 0.4032 -0.4032 0.6336 -0.9504 0.6336 -1.5264 s -0.2016 -1.1232 -0.6336 -1.4976 z"></path>
                            </LinkSvgIcon>
                        </LinkSvgIconWrapper>
                    </RivalDescription>
                    <BlankBox/>
                    <BlankBox/>
                        <RatingTitle>
                            추천된 라이벌 또는 <Phone><br/></Phone>문제가 만족스러우신가요?
                        </RatingTitle>
                        <RatingStar/>
                    <BlankBox/>
                    <BlankBox/>
                    <SectionTitle>
                        라이벌 추천에 관한 <Phone><br/></Phone>궁금증을 정리했어요.
                    </SectionTitle>
                    <RivalRecFAQ/>
                    <BlankBox/>
                    </ContentInnerContainer>
                    </ContentContainer>
                <MainFooter />
        </div>
    );
}

export default Userrival;