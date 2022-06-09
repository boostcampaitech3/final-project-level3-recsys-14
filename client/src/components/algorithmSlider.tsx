import styled, { keyframes } from "styled-components"
import {
    primary_purple,
    light_blue,
    bright_purple,
    light_sky_gray,
    light_purple,
    bright_purple_pink,
    light_pink,
    so_purple,
    dark_purple_blue,
    deep_purple,
    dawn_purple,
    light_pink_white,
} from "../constants/color"
import iconGeometry from "../assets/icons/icon_geometry.png";
import iconMath from "../assets/icons/icon_math.png";
import iconGraphs from "../assets/icons/icon_graphs.png";
import iconGreedy from "../assets/icons/icon_greedy.png";
import iconDataStructure from "../assets/icons/icon_data_structure.png";
import iconDP from "../assets/icons/icon_dp.png";
import iconString from "../assets/icons/icon_string.png";
import iconImplemetation from "../assets/icons/icon_implementation.png";

export const algorithmType = [
    {
        "id": "Math",
        "tag": "math",
        "image": iconMath,
    }, 
    {
        "id": "Geometry",
        "tag": "geometry",
        "image": iconGeometry,
    }, 
    {
        "id": "Dynamic Programming",
        "tag": "dp",
        "image": iconDP,
    }, 
    {
        "id": "Data Structures",
        "tag": "data_structures",
        "image": iconDataStructure,
    },
    {
        "id": "Graphs",
        "tag": "graphs",
        "image": iconGraphs,
    },
    {
        "id": "Implementation",
        "tag": "implementation",
        "image": iconImplemetation,
    },
    {
        "id": "Greedy",
        "tag": "greedy",
        "image": iconGreedy,
    }, 
    {
        "id": "String",
        "tag": "string",
        "image": iconString,
    },
]

const scrollSlider = keyframes`
    0% { 
        transform: translateX(0); 
    }
    100% { 
        transform: translateX(calc(-250px * ${algorithmType.length}))
    }
`;

export const AlgorithmSlider = styled.div`
    display: block;
    background-color: rgba(255, 255, 255, 0);
    width: 100%;
    max-width: 1200px;
    height: min(calc(200px + 5vmin), 300px);
    margin: 2.4rem 0;
    padding: 3rem 0;
    overflow:hidden;
    position: relative;
    &::before,
    &::after {
        background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
        content: "";
        height: min(calc(200px + 5vmin), 300px);
        position: absolute;
        width: 100px;
        z-index: 20;
    }

    &::before {
        left: 0;
        top: 0;
    }

    &::after {
        right: 0;
        top: 0;
        transform: rotateZ(180deg);
    }
`;

export const AlgorithmSliderTrack = styled.div`
    display: flex;
    animation: ${scrollSlider} 40s linear infinite;
    width: calc(250px * ${algorithmType.length} * 2);
`;

export const AlgorithmSlide = styled.div`
    display: block;
    width: 250px;
    height: min(calc(120px + 5vmin), 200px);
    margin: 0px 20px;
    border-radius: 1.5rem;
    background-color: rgb(254 254 254 / 40%);
    transition: transform .5s ease-out;
    box-shadow:
        0 2px 6px 0 rgb(136 148 171 / 20%), 0 24px 20px -24px rgb(71 82 107 / 10%);
    overflow: hidden;
    &:hover{
        transform: scale(1.05, 1.05);
        cursor: pointer;
    }
    > a{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        text-decoration: none;
        z-index: 10;
        background-color: #FFF;
        opacity: 0;
        filter: alpha(opacity=1);
    }
    > img{
        width: auto;
        height: 70%;
        margin: auto;
        object-fit: contain;
        display: block;
    }
`;

export const AlgorithmSlideHeader = styled.div`
    width: 100%;
    font-weight: bold;
    padding: 10px 0;
    z-index: 10;
    text-align: center;
    border-radius: 1.5rem 1.5rem 0 0;
`;