/* eslint-disable */
import React from "react";
import styled from "styled-components";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';

import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import RivalSlide from "./rivalCarousel";

import {Nav} from "react-bootstrap"
import { RootState } from "../modules";
import { userSearchInputState } from "../modules/userSearchInput";
import { API } from "../utils/axios";
import { useSelector } from "react-redux";

import TagSwitch from "./TagSwitch";

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
    color: #595959;
    font-size: 1.5rem;
    margin: 10px 0;
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

function Rival(){
    const [rival, setRival] = React.useState([]);
    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    console.log(userHandle)
    const fetchprob = async() =>{
        try{
            const {data} = await API.get(`/recommend/rival/show?handle=${userHandle}`);

            const rivallist = await API.get(`/user/lookup?handles=${data.rec_rivals.join()}`)
            console.log(rivallist);

            setRival(rivallist.data);
        }
        catch(e){
            console.error(e);
        }
    }
    React.useEffect(()=>{
        fetchprob();
    }, [userHandle]);
    
    return(
        <Box>
                <CarouselTitle>{userHandle}님과 수준이 비슷한 유저</CarouselTitle>
                <RivalSlide rival = {rival} />
       </Box>
    );
}
export default Rival;
