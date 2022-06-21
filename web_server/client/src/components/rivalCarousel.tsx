import React, {useCallback, useEffect, useRef, useState} from 'react';
import Slick from 'react-slick';
import styled, {css} from 'styled-components';
import {useSelector} from 'react-redux';
import { RootState } from "../modules";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {Nav} from "react-bootstrap"
import { height } from '@mui/system';
import RivalItemContainer from '../container/rivalItemContainer';
import { oh_purple, so_gray } from '../constants/color';

const Wrap = styled.div`
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    & > div + div{
        margin-top: 20px;
    }
    .slick-slide {
        display: inline-block;
    }
    &::before,
    &::after {
        background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
        content: "";
        height: 100%;
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
const Inner = styled.div`
    position: relative;
    /* display: flex;
    justify-content: center;
    align-items: center; */
    ${({property}) => {
        return (property === "mainInner") ? 
        (css`
        width : 100%;
        height : 100%;    
        `) : 
        (css`
        width : 100%;
        height : 30%;`);
    }}
    /* width: 100%;
    height: 100%; */
    .paging_items{
        filter: grayscale(1);
        &:hover {
            filter: none;
        }
    }
    .slick-current .paging_items {
        filter: none;
    }
    .slick-slide{
        padding: 1.2rem;
        margin: 10px 0px 50px;
    }
`;
const defaultItemStyle = css`
    width: 100%;
    text-align: center;

    .item{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 200px;
        vertical-align: top;
    }
`;
const MainSlickItems = styled.div`
    ${defaultItemStyle}
    height: 100%;
    border-radius: 1rem;
    transition: transform 0.3s ease-out;

    &:hover {
        transform: scale(1.1);
    }

    .item{
        max-width: 100%;
        padding: 20px;
        box-shadow: 0px 15px 35px -5px rgb(50 88 130 / 32%);
    }
`;
const PagingItems = styled.div`
    ${defaultItemStyle}
    height: 80px;
    cursor: pointer;

    .item {
        width:100%
    }
`
const defaultButtonStyle = css`
    position: absolute;
    z-index: 100;
    padding: 0;
    width: 30px;
    height: 30px;
    line-height: 1;
    border: none;
    border-radius: 50%;
    background: none;
    outline : none;
    transform: translateY(-50%);
    cursor: pointer;
    background: rgb(255 255 255 / 70%);
    box-shadow:
        1px 2px 8px -3px rgb(50 88 130 / 32%);
`;
const PrevButton = styled.button`
    ${defaultButtonStyle}
    ${({property}) => {
        return (property === "mainButton") ? 
        `
        top : 42%;    
        `
        : 
        `
        top : 80%;
        `;
    }}
    left: 0;
`;
const NextButton = styled.button`
    ${defaultButtonStyle}
    ${({property}) => {
        return (property === "mainButton") ? 
        `
        top : 42%;  
        `
        :
        `
        top : %0%;
        `;
    }}
    right: 0;
`;
const defaultIconStyle = css`
    color: #9c9c9c;;

    &:focus,
    &:hover{
        color: #666;
    }
`;
const PrevIcon = styled(ArrowBackIosIcon)`
    ${defaultIconStyle}
`;
const NextIcon = styled(ArrowForwardIosIcon)`
    ${defaultIconStyle}
`;

const ErrorBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: relative;
    background: white;
    width: 90%;
    padding: 1.2rem;
    font-weight: 500;
    color: ${so_gray};
    min-height: 150px;
    margin: 20px auto 60px;
    border-radius: 1rem;
    box-shadow: 0px 15px 35px -5px rgb(50 88 130 / 32%);
    transition: all 0.6s cubic-bezier(.25,.8,.25,1) 0.3s;
    & p{
        width: 100%;
        text-align: center;
    }
`;

const SproutLinkButton = styled.button`
    border-radius: 20px;
    margin-top: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1.15px;
    padding: 5px 10px;
    background-color: ${oh_purple};
    color: #f9f9f9;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
`;

const RivalSlide = (children : any) => {
    const [mainSlick, setMainSlick] = useState<any>(null);
    const [pagingSlick, setPagingSlick] = useState<any>(null);
    const mainSlickRef = useRef<Slick>(null);
    const pagingSlickRef = useRef(null);

    const rivalProblemItem = useSelector((state: RootState) => state.rivalProblemItem)
    const tagSwitch = useSelector((state : RootState) => state.tagSwitch.toggle);

    const controllAutoPlay = ()=>{
        // console.log(mainSlickRef);
        // console.log(rivalProblemItem.toggle);
        // console.log('flag : ', (rivalProblemItem.toggle && tagSwitch))

        if (rivalProblemItem.toggle && tagSwitch){
            mainSlickRef.current?.slickPause();
            // mainSettings = {...mainSettings, autoplay: false}
        }
        else {
            mainSlickRef.current?.slickPlay();
            // mainSettings = {...mainSettings, autoplay: true}

        }
    };
    
    useEffect(()=>{
        setMainSlick(mainSlickRef.current);
        setPagingSlick(pagingSlickRef.current);
    }, []);

    // useEffect(()=>{
    //     if(rivalProblemItem.toggle&& tagSwitch){
    //         mainSettings = {...mainSettings, autoplay: false}
    //     }
    //     else{
    //         mainSettings = {...mainSettings, autoplay: true}
    //     }
    // }, [rivalProblemItem, tagSwitch])
    
    const mainSettings = {
        infinite: children.rival.length > 3.5,
        centerMode: true,
        swipeToSlide: true,
        slidesToShow: 3.68,
        slidesToScroll: 1,
        autoplay : true,
        pauseOnHover: true,
        autoplaySpeed: 5000,
        // beforeChange: controllAutoPlay,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    infinite: children.rival.length > 2.5,
                    slidesToShow: 2.34,
                    slidesToScroll: 1,
                }
              },
            {
              breakpoint: 800,
              settings: {
                infinite: children.rival.length > 1.5,
                slidesToShow: 1.67,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 480,
              settings: {
                infinite: children.rival.length > 1,
                autoplay: false,
                pauseOnHover: false,
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            }
        ]
    };
    const pagingSettings = {
        dots: false,
        arrows: false,
        centerMode: true,
        slidesToShow: 5,
        swipeToSlide: true,
        focusOnSelect: true,
    };
    const onClickPrev = useCallback((ref : any) => () => ref.current.slickPrev(), []);
    const onClickNext = useCallback((ref : any) => () => ref.current.slickNext(), []);

    return(
        <Wrap className='wrap'>
            <Inner property='mainInner'>
            {children.validAPI ? 
                <Slick
                    ref = {mainSlickRef}
                    {...mainSettings}
                    >
                        {children.rival.map((item : any, i : number)=>{
                            return(
                                <MainSlickItems key={i}>
                                    <RivalItemContainer key = {i} rival = {item}/>
                                </MainSlickItems>
                                )
                            }) 
                        }
                </Slick>
                :
                <ErrorBox>
                    <p>사용자님의 문제 풀이 이력이 너무 적거나, 업데이트 된 데이터에 관해 반영되지 않았습니다.</p>
                    <a href = {`https://solved.ac/problems/sprout`} target='_blank'>
                    <SproutLinkButton>
                        새싹 문제부터 풀러 가기 
                    </SproutLinkButton>
                    </a>
                </ErrorBox>
                }
               {children.validAPI ? 
                    <> 
                        <PrevButton onClick={onClickPrev(mainSlickRef)} property='mainButton'>
                            <PrevIcon />
                        </PrevButton>
                        <NextButton onClick={onClickNext(mainSlickRef)} property='mainButton'>
                            <NextIcon />
                        </NextButton>
                        </>
                        :
                        <></>
                    }
            </Inner>

        </Wrap>
    );
};

export default RivalSlide;