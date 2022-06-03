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
import { RootState } from "../modules";
import RivalProblem from "../components/rivalProblem";
import rivalBackgroundImage from "../assets/images/rival_background_large.png";
import rivalRecImage from "../assets/images/rival_rec_large.png";
import RivalRecFAQ from "../components/rivalRecFAQ";

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

const BlankBox = styled.div`
    display: block;
    weight: 100%;
    height: 70px;
`;

const MyProfileTitle = styled.h4`
    display: flex;
    color: #323232;
    font-weight: 600;
    font-size: 1.5rem;
    margin: 10px 0;
`;

function Userrival() {
    const [profile, setProfile] = useState({});

    const params = useParams();
    console.log(params);

    const location = useLocation();

    const dispatch = useDispatch();
    const userHandleDispatch = useCallback((userHandle : string | undefined)=> dispatch(search(userHandle)), [dispatch])


    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const rivalItem = useSelector((state : RootState) => state.rivalItem)
    const rivalProblem = useSelector((state:RootState) => state.rivalProblemItem)
    const tagSwitch = useSelector((state:RootState) => state.tagSwitch.toggle);

    console.log(userHandle);

    let navigate = useNavigate();

    const fetchMyProfile = async() =>{
        try{
            const {data} = await API.get(`/user/show?handle=${params.userHandle}`)
            setProfile(data)
        }
        catch(e){
            console.log(e);
        }
    }

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${params.userHandle}`);
            fetchMyProfile();
            console.log(data);
        }
        catch(e){
            console.error(e);
            alert("Wrong User !");
            navigate('/');
        }
    }
    useEffect(()=>{
        fetchUserCheck();
        userHandleDispatch(params.userHandle);
    }, [params]);

    return(
        <div>
            <NavBar pathname = {location.pathname}/>
            <RivalIntroBox>
                <RivalBackgroundStyledDiv />
                <RivalIntroStyledDiv>
                    지피지기면 백전백승.<br/>
                    너의 실력이 곧 나의 실력.<br/>
                </RivalIntroStyledDiv>
                <RivalIntroStyledSpan>
                    {userHandle} 님과 비슷한 실력을 가진 라이벌을 추천해 드릴게요.<br/>
                    그리고 라이벌이 풀었지만 내가 풀지 않았던 문제도 알려드려요. <br/>
                </RivalIntroStyledSpan>
                <RivalIntroImage/>
                <MyProfileTitle>현재 {userHandle} 님의 데이터입니다.</MyProfileTitle>
                <RivalDetailWrapper>
                    <RivalDetail rival = {profile} />
                </RivalDetailWrapper>
                <BlankBox/>
                </RivalIntroBox>
                <SliderWrap>
                    <Rival />
                    {rivalItem.toggle && <RivalDetail rival = {rivalItem.rival} />}
                </SliderWrap>
                <BlankBox/>
                <SliderWrap>
                    <RivalProblem />
                    {rivalProblem.toggle && tagSwitch && <ProblemDetail item = {rivalProblem.item} />}
                </SliderWrap>
                <ContentContainer>
                    <ContentInnerContainer>
                    <BlankBox/>
                    <SectionTitle>
                        라이벌 추천에 관한 궁금증을 정리했어요.
                    </SectionTitle>
                    <RivalRecFAQ/>
                    </ContentInnerContainer>
                    </ContentContainer>
                <MainFooter />
        </div>
    );
}

export default Userrival;