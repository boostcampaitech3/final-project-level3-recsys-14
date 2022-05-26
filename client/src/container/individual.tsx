/* eslint-disable */
import React from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';

import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Slide from "./carousel";

import {Nav} from "react-bootstrap"

// export const StyledSlider = styled(Slider)`
//    /* height: 90%; //슬라이드 컨테이너 영역 */
//    /* Slider */
// .slick-slider
// {
//     position: absolute;

//     display: inline-block;
//     box-sizing: content-box;
//     -webkit-user-select: none;
//        -moz-user-select: none;
//         -ms-user-select: none;
//             user-select: none;

//     -webkit-touch-callout: none;
//     -khtml-user-select: none;
//     -ms-touch-action: pan-y;
//         touch-action: pan-y;
//     -webkit-tap-highlight-color: transparent;
// }

// .slick-list
// {
//     position: relative;

//     display: block;
//     overflow: hidden;

//     margin: 0;
//     padding: 0;
// }
// .slick-list:focus
// {
//     outline: none;
// }
// .slick-list.dragging
// {
//     cursor: pointer;
//     cursor: hand;
// }

// .slick-slider .slick-track,
// .slick-slider .slick-list
// {
//     -webkit-transform: translate3d(0, 0, 0);
//        -moz-transform: translate3d(0, 0, 0);
//         -ms-transform: translate3d(0, 0, 0);
//          -o-transform: translate3d(0, 0, 0);
//             transform: translate3d(0, 0, 0);
// }

// .slick-track
// {
//     position: relative;
//     top: 0;
//     left: 0;

//     display: block;
//     margin-left: auto;
//     margin-right: auto;
// }
// .slick-track:before,
// .slick-track:after
// {
//     display: table;

//     content: '';
// }
// .slick-track:after
// {
//     clear: both;
// }
// .slick-loading .slick-track
// {
//     visibility: hidden;
// }

// .slick-slide
// {
//     display: none;
//     float: left;

//     height: 100%;
//     min-height: 1px;
// }
// [dir='rtl'] .slick-slide
// {
//     float: right;
// }
// .slick-slide img
// {
//     display: block;
// }
// .slick-slide.slick-loading img
// {
//     display: none;
// }
// .slick-slide.dragging img
// {
//     pointer-events: none;
// }
// .slick-initialized .slick-slide
// {
//     display: block;
// }
// .slick-loading .slick-slide
// {
//     visibility: hidden;
// }
// .slick-vertical .slick-slide
// {
//     display: block;

//     height: auto;

//     border: 1px solid transparent;
// }
// .slick-arrow.slick-hidden {
//     display: none;
// }

// `;

export const Box = styled.div`
    position: relative;
    padding-top: 10px;
    padding-bottom : 10px;
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 500px;
    justify-content: center;
    align-items: center;
    margin : 0 auto;
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

function Individual(){
    const [indvdprob, setIndvprob] = React.useState([{id : -1, probId : '999', tag: [''],flag : false}]);
    const fetchprob = async() =>{
        try{
            const {data} = await axios.get('http://localhost:3001/problem/individual');
            console.log(data);

            setIndvprob(data);
        }
        catch(e){
            console.error(e);
        }
    }
    React.useEffect(()=>{
        fetchprob();
    }, []);

    
    return(
        <Box>
                <h4>개인화된 문제 추천</h4>
                <Slide probs = {indvdprob} />
       </Box>
    );
}
export default Individual;