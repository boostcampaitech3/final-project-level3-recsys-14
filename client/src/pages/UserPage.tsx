/* eslint-disable */
import React, { useEffect, useState } from "react";

import styled, {css} from "styled-components";
import {Individual, Diverse, ProblemDetail} from '../components'
import NavBar from "../components/navbar";
import MainFooter from "../components/footer";
import {useSelector, useDispatch} from 'react-redux';
import { API } from "../utils/axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { search } from "../modules/userSearchInput";
import { RootState } from "../modules";
import userBackgroundImage from '../assets/images/user_background_large.png';
import userRecImage from "../assets/images/problem_rec_large.png";

const Box = styled.div`
    display : flex;
    z-index : 500;
    background-color: aqua;
`;

const SearchBox = styled.div`
    display : flex;
    z-index : 1000;
    transform : translate(-50%, 0);
`;

const UserIntroBox = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const UserIntroImage = styled.div`
    width: 100%;
    height: min(max(calc(240px + 10vmin), 340px), 380px);
    border: 0px;
    background: url(${userRecImage}) center center / contain no-repeat;
`;

const UserIntroStyledSpan = styled.span`
    color: #c89d7a;
    text-align: center;
    font-size: min(max(calc(10px + 1vmin), 10px), 18px);
    font-weight: 500;
`;

const UserIntroStyledDiv = styled.div`
    color: #fff;
    text-align: center;
    text-shadow:
        1px 1px 4px rgb(0 0 0 / 10%),
        2px 2px 8px rgb(0 0 0 / 14%);
    font-size: min(max(calc(16px + 3.6vmin), 20px), 54px);
    font-weight: 800;
    margin: 2.5rem 0;
`;

const UserBackgroundStyledDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: min(calc(400px + 10vmin), 540px);
    z-index: -1;
    background: url(${userBackgroundImage}) center center / cover no-repeat;
    -webkit-mask: 
        -webkit-gradient( linear, 0% 80%, 0% 0%, from(rgba(0, 0, 0, 0.8)), to(rgb(0, 0, 0, 1)) );
`;

function Userpage() {
    const params = useParams();
    console.log(params);

    const location = useLocation();
    console.log(location.pathname);

    const dispatch = useDispatch();
    dispatch(search(params.userHandle));

    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);

    const problemItem = useSelector((state: RootState) => state.problemItem)
    // console.log(problemItem);
    let navigate = useNavigate();

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${userHandle}`);
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
    }, [userHandle]);
    useEffect(()=>{
        
    }, []);
    
    return(
        <div>
            <NavBar userHandle = {userHandle} pathname = {location.pathname}/>
            <UserIntroBox>
            <UserBackgroundStyledDiv />
            <UserIntroStyledDiv>
                내가 모르던 나를 위한 문제.<br/>
                한눈에 모아보다.
            </UserIntroStyledDiv>
            <UserIntroStyledSpan>
                {userHandle} 님에게 맞는 문제를 영역별로 추천해 드릴게요.<br/>
                본인의 목적에 맞는 문제를 찾아 풀어보세요.<br/>
            </UserIntroStyledSpan>
            <UserIntroImage/>
            </UserIntroBox>
            <div style={{display : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection : 'column'}}>
                <Individual userHandle = {userHandle}/>
            </div>
            {problemItem.toggle && <ProblemDetail item = {problemItem.item}/>}
            <MainFooter />
        </div>
    );
}

export default Userpage;