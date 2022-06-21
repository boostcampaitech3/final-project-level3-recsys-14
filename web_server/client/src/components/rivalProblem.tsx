/* eslint-disable */
import React from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';

import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import RivalItemSlide from "./rivalProblemCarousel";

import {Nav} from "react-bootstrap"
import { RootState } from "../modules";
import { userSearchInputState } from "../modules/userSearchInput";
import { API } from "../utils/axios";
import {useSelector} from 'react-redux';
import TagSwitch from "./TagSwitch";
import TagSwitchContainer from "../container/tagSwitchContainer";
import { Phone } from "../constants/mediaQuery";
import ProblemDetail from "./problemDetail";
import ProblemItemList from "./problemItemList";

export const Box = styled.div`
    position: relative;
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    /* height: 500px; */
    justify-content: center;
    align-items: center;
    margin : 0 auto;
`;

export const CarouselTitle = styled.h4`
    display: flex;
    text-align: center;
    color: #323232;
    font-weight: 600;
    font-size: 1.5rem;
    margin: 10px 0;
    @media screen and (max-width: 480px){
        display: block;
        text-align: center;
    }
`;

export const CarouselItem = styled.div`
    padding: 10px;
    background-clip: content-box;
    background-color: lightgray;
`;

export const CarouselBtn = styled.div`
    position: absolute;
    width: max-content;
    ${({dir}) => {
        return (dir === "prev") ? `left : 0` : `right : 0`;
    }}
    top: 50%;
    transform: translate(0%, -50%);
`;


function RivalProblem(){
    const [rivalprob, setRivalprob] = React.useState([]);
    const [validAPI, setValidAPI] = React.useState(false);

    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const rivalProblem = useSelector((state:RootState) => state.rivalProblemItem)
    const tagSwitch = useSelector((state:RootState) => state.tagSwitch.toggle);

    // console.log(userHandle) //13번째
    const fetchprob = async() =>{
        try{
            const {data} = await API.get(`/recommend/rival/problem/show?handle=${userHandle}`);

            // let problist = data.rec_problems.map((prob : string) => {
            //     let probObj = {probId : 1, tag : ['']};
            //     probObj['probId'] = Number(prob);
            //     probObj['tag'] = ['수학', '구현', '기하학', '그래프'];
            //     return probObj
            // });

            const problist = await API.get(`/problem/lookup?problemIds=${data.rec_problems.join()}`)
            // console.log(problist);//12번째

            setRivalprob(problist.data);
            setValidAPI(true);
        }
        catch(e){
            setValidAPI(false);
            // console.error(e); //10번째
        }
    }
    React.useEffect(()=>{
        fetchprob();
    }, [userHandle]);
    
    return(
        <Box>
                <CarouselTitle>라이벌이 푼 문제도 <Phone><br/></Phone>같이 풀어볼까요?<TagSwitchContainer /></CarouselTitle>
                <RivalItemSlide validAPI = {validAPI} rivalprobs = {rivalprob} />
                {rivalProblem.toggle && tagSwitch && <ProblemDetail item = {rivalProblem.item}/>}
                <ProblemItemList validAPI={validAPI} probs={rivalprob}></ProblemItemList>
       </Box>
    );
}
export default RivalProblem;
