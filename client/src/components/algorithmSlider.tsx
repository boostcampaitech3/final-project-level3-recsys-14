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
    light_pink_white,
} from "./color"

export const algorithmType = [
    "Math", "Geometry", "Dynamic Programming", "Data Structures",
    "Graphs", "Implementation", "Greedy", "String"
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
    height: 250px;
    margin: 3rem 0;
    padding: 3rem 0;
    overflow:hidden;
    position: relative;
    &::before,
    &::after {
        background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
        content: "";
        height: 200px;
        position: absolute;
        width: 100px;
        z-index: 2;
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
    height: 150px;
    margin: 0px 20px;
    border-radius: 1.5rem;
    background-color: ${light_pink_white};
    box-shadow:
        inset 1px 1px .3rem rgba(255, 255, 255, 0.5),
        inset -1px -1px .3rem ${light_pink},
        .2rem .2rem .3rem rgba(0, 0, 0, 0.5)
`;