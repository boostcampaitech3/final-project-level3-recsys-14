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
    AlgorithmSlideHeader,
} from "../components/algorithmSlider";
import introImage from '../assets/images/main_large.png';
import mainBackgroundImage from '../assets/images/main_background_large.png';

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
    font-size: min(max(calc(16px + 3.6vmin), 20px), 54px);
    font-weight: 800;
    margin: 30px 0;
`;

const IntroStyledSpan = styled.span`
    color: #fafafa;
    text-align: center;
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

    const clickSlide = (nextLink: string) => () => {
        window.location.href= nextLink;
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
                개인별 풀만한 문제와 라이벌을 추천해 드립니다.
            </IntroStyledSpan>
            <IntroImageStyledDiv />
            <UserSearchInputContainer />
            <ContentConatiner>
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
            </ContentConatiner>
        </Box>
        </div>
    );
}

export default Usersearch;
