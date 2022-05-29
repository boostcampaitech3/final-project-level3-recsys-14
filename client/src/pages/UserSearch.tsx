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
import { 
    algorithmType, 
    AlgorithmSlider, 
    AlgorithmSliderTrack,
    AlgorithmSlide,
} from "../components/algorithmSlider";
import introImage from '../assets/images/main_large.png';

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
    text-align: center;
    font-size: calc(16px + 3.6vmin);
    font-weight: 800;
    margin: 30px 0;
    &:p
`;

const IntroStyledSpan = styled.span`
    color: #323232;
    text-align: center;
    font-size: calc(10px + 1vmin);
    font-weight: 500;
`;


const IntroImageStyledDiv = styled.div`
    width: 100%;
    height: calc(240px + 10vmin);
    max-width: 1120px;
    max-height: 500px;
    border: 0px;
    background: url(${introImage}) center center / contain no-repeat;
`;

const ContentConatiner = styled.div`
    width: 100%;
    max-width: 1200px;
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
            console.log(user)
            const {data} = await API.get(`/user/check?handle=${user.userId}`);
            console.log(data, data.message);

            switch(data.message){
                case `${user.userId} exists.`:
                    console.log(true);
                    search_flag = true;
                    break;

                default:
                    console.log(false);
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
            console.log(err);
        }
        setUser({userId: ''});
    }
    const onInput = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            fetchvalid();            
        }
    }

    return(
        <div> 
        <NavBar/>
        <Box>
            <IntroStyledDiv>
                나를 위한 알고리즘 문제 추천
            </IntroStyledDiv>
            <IntroStyledSpan>
                문제 풀이 이력과 유저 정보를 바탕으로<br/>
                개인별 풀만한 문제와 라이벌을 추천해 드립니다.
            </IntroStyledSpan>
            <IntroImageStyledDiv />
            <UserSearchInputContainer />
            <ContentConatiner>
            <AlgorithmSlider>
            <AlgorithmSliderTrack>
                {
                    algorithmType.map((algorithm) => (
                        <AlgorithmSlide key={algorithm + "1"}>
                            {algorithm}
                        </AlgorithmSlide>
                    ))
                }
                {
                    algorithmType.map((algorithm) => (
                        <AlgorithmSlide key={algorithm + "2"}>
                            {algorithm}
                        </AlgorithmSlide>
                    ))
                }
            </AlgorithmSliderTrack>
            </AlgorithmSlider>
            </ContentConatiner>
        </Box>
        </div>
    );
}

export default Usersearch;
