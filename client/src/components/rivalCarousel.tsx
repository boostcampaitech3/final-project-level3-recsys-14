import React, {useCallback, useEffect, useRef, useState} from 'react';
import Slick from 'react-slick';
import styled, {css} from 'styled-components';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {Nav} from "react-bootstrap"
import { height } from '@mui/system';

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
    .slick-slid {
        display: inline-block;
        width: 100%;
    }
`;
const Inner = styled.div`
    position: relative;
    /* display: flex;
    justify-content: center;
    align-items: center; */
    ${({property}) => {
        return (property == "mainInner") ? 
        (css`
        padding-top : 20px;
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
        padding: 10px
    }
`;
const defaultItemStyle = css`
    width: 100%;
    text-align: center;
    .item{
        height: 100%;
        vertical-align: top;
    }
`;
const MainSlickItems = styled.div`
    ${defaultItemStyle}
    height: 100%;
    background-color: lightgray;

    .item{
        max-width: 100%;
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
    
    padding :0;
    width: 30px;
    height: 30px;
    line-height: 1;
    border: none;
    border-radius: 50%;
    background: none;
    outline : none;
    transform: translateY(-50%);
    cursor: pointer;
`;
const PrevButton = styled.button`
    ${defaultButtonStyle}
    ${({property}) => {
        return (property == "mainButton") ? 
        `
        top : 30%;    
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
        return (property == "mainButton") ? 
        `
        top : 30%;  
        `
        :
        `
        top : %0%;
        `;
    }}
    right: 0;
`;
const defaultIconStyle = css`
    font-size: 22px;
    color: #dedede;

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

const RivalSlide = (children : any) => {
    const [mainSlick, setMainSlick] = useState<any>(null);
    const [pagingSlick, setPagingSlick] = useState<any>(null);
    const mainSlickRef = useRef(null);
    const pagingSlickRef = useRef(null);

    useEffect(()=>{
        setMainSlick(mainSlickRef.current);
        setPagingSlick(pagingSlickRef.current);
    }, []);

    const mainSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
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
                <Slick
                    ref = {mainSlickRef}
                    asNavFor = {pagingSlick}
                    {...mainSettings}
                    >
                        {children.probs.map((item : any, i : number)=>{
                            return(
                                <MainSlickItems key={`${i}`}>
                                    <div className='item'>
                                        <div style={{display:'flex'}}>
                                            <h3>{item.tier}</h3>
                                            <h2>
                                                <Nav.Link href = {`https://solved.ac/profile/${item.handle}`} target='_blank'> {item.handle} </Nav.Link>
                                            </h2>
                                        </div>
                                        <div>rating : {item.rating}</div>
                                        <div>rank : {item.rank}</div>

                                    </div>
                                </MainSlickItems>
                            )
                        })}
                </Slick>
                <>
                        <PrevButton onClick={onClickPrev(mainSlickRef)} property='mainButton'>
                            <PrevIcon />
                        </PrevButton>
                        <NextButton onClick={onClickNext(mainSlickRef)} property='mainButton'>
                            <NextIcon />
                        </NextButton>
                </>
            </Inner>

            {/* <Inner property ='subInner'>
                <Slick
                    ref = {pagingSlickRef}
                    asNavFor={mainSlick}
                    {...pagingSettings}
                >
                    {children.probs.map((item : any, i: number) =>{
                        return(
                            <PagingItems key = {`${i}`} className="paging_items">
                                <div className='item'>
                                    <h2>
                                        {item.probId}
                                    </h2>
                                </div>
                            </PagingItems>
                        )
                    })}
                </Slick>
                <>
                    <PrevButton onClick={onClickPrev(pagingSlickRef)} property='subButton'>
                        <PrevIcon />
                    </PrevButton>
                    <NextButton onClick={onClickNext(pagingSlickRef)} property='subButton'>
                        <NextIcon />
                    </NextButton>
                </>
            </Inner> */}
        </Wrap>
    );
};

export default RivalSlide;