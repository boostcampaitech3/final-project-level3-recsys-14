/* eslint-disable */
import React, { useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';

import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import RivalSlide from "./rivalCarousel";

import {Alert, Nav} from "react-bootstrap"
import { RootState } from "../modules";
import { userSearchInputState } from "../modules/userSearchInput";
import { API } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";

import TagSwitch from "./TagSwitch";
import { clickClose } from "../modules/alertClose";
import { Phone } from "../constants/mediaQuery";
import { Link } from "react-router-dom";

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
    margin: 10px 20px;
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
    const [validAPI, setValidAPI] = React.useState(false);
    const [show, setShow] = React.useState(true);

    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const alertClose = useSelector((state: RootState) => state.alertClose.toggle)

    const dispatch = useDispatch();
    const onClickClose = useCallback(() => dispatch(clickClose()), [dispatch]);
    
    // console.log(userHandle)
    const fetchprob = async() =>{
        try{
            const {data} = await API.get(`/recommend/rival/show?handle=${userHandle}`);

            const rivallist = await API.get(`/user/lookup?handles=${data.rec_rivals.join()}`)
            // console.log(rivallist);

            setRival(rivallist.data);
            setValidAPI(true);
        }
        catch(e){
            setValidAPI(false);
            // console.error(e);
        }
    }
    React.useEffect(()=>{
        fetchprob();
    }, [userHandle]);
    
    return(
        <Box>
                <CarouselTitle>{userHandle}님의 <Phone><br/></Phone>라이벌로 추천합니다.</CarouselTitle>
                { alertClose && <Alert variant="light"
                    onClose={onClickClose} dismissible>
                    <div>
                    잠깐, 라이벌 등록 페이지로 이동하기 전에 solved.ac 로그인이 되어 있나요? <br/>
                    추천된 라이벌을 등록하러 가는 링크를 클릭하기 전에 <a href="https://solved.ac/" target="_blank">solved.ac 로그인</a>이 되어 있는지 우선 확인해주세요!
                    </div>
                </Alert> }
                <RivalSlide validAPI = {validAPI} rival = {rival} />
       </Box>
    );
}
export default Rival;
