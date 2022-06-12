import React, { ChangeEvent, useState, useEffect } from "react";
//import RatingStars from "react-star-rating-component"
import { Rating } from "@mui/material";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { API } from "../utils/axios";
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import styled from "styled-components";
import { oh_purple, so_gray } from "../constants/color";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RootState } from "../modules";
import { useSelector } from "react-redux";

const RatingWrapper = styled(Box)`
    @media screen and (max-width: 800px){
        text-align: center !important;
    }
`;

const ResBox = styled.div`
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
    min-height: 15px;
    margin: 20px auto 60px;
    border-radius: 1rem;
    box-shadow: 0px 15px 35px -5px rgb(50 88 130 / 32%);
    transition: all 0.6s cubic-bezier(.25,.8,.25,1) 0.3s;
    & p{
        width: 100%;
        margin: 1rem auto;
        text-align: center;
    }
`;


const SubmitButton = styled.button`
    width: auto;
    height: 40px;
    border-radius: 10px;
    margin-top: 10px;
    font-weight: 700;
    padding: 0 10px;
    font-size: 0.8rem;
    letter-spacing: 1.15px;
    background-color: ${oh_purple};
    color: #f9f9f9;
    box-shadow: 4px 4px 8px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
    transition: transform .5s ease-out;
    &:hover{
        transform: scale(1.1, 1.1);
        cursor: pointer;
    }
`;

const AutocompleteWrapper = styled.div`
    width: 100%;
    margin: 1.2rem 0;
`;

const inputOptions = ['너무 쉬워요!', '제 수준에 맞아요!', '너무 어려워요!'];

const RatingStar = () => {

    const location = useLocation();
    // console.log('location : ', location)
    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);


    const handleParams = useParams();

    const [value, setValue] = useState<number | null>(3);
    const [autovalue, setAutovalue] = useState('');
    const [inputvalue, setInputvalue] = useState('');

    const [hover, setHover] = useState(-1);
    const [flag, setFlag] = useState(true);


    useEffect(()=>{
        // userHandleDispatch(params.userHandle);
        setFlag(true);
    }, [handleParams]);


    const onChange = (e : ChangeEvent<HTMLInputElement>) => {
        if(e.target.value == ''){
            setInputvalue(autovalue);
        }else{
            setInputvalue(e.target.value);
        }
    };
    
    const feedBack = async(body : any) =>{
        try{
            const res = await API.post(`/feedback/send`, body);
            // console.log(res); //11번째
        }
        catch(e){
            // console.error(e);

        }
    } 

    const onClick = () =>{
        if(location.pathname == `/user/${userHandle}`){
            const body = {handle : userHandle, problem_rating : value, problem_feedback : inputvalue};
            // console.log('page : user', 'handle : ', userHandle, 'hover : ', value, 'feedback : ', inputvalue);
            feedBack(body)
        }
        else{
            const body = {handle : userHandle, rival_rating : value, rival_feedback : inputvalue};
            // console.log('page : rival', 'handle : ', userHandle, 'hover : ', value, 'feedback : ', inputvalue);
            feedBack(body)
        }
        setFlag(false);
    }

    const onEnter = (e : any) =>{
        if(e.key === 'Enter'){
            if(location.pathname == `/user/${userHandle}`){
                const body = {handle : userHandle, problem_rating : value, problem_feedback : inputvalue};
                // console.log('page : user', 'handle : ', userHandle, 'hover : ', value, 'feedback : ', inputvalue);
                feedBack(body)
            }
            else{
                const body = {handle : userHandle, rival_rating : value, rival_feedback : inputvalue};
                // console.log('page : rival', 'handle : ', userHandle, 'hover : ', value, 'feedback : ', inputvalue);
                feedBack(body)
            }
            setFlag(false);
        }
    }  
    return(
        <>
        {flag ?
        <RatingWrapper>
            <Rating
                name="hover-feedback"
                value={value}
                precision={1}
                onChange={(e,newValue) =>{
                    setValue(newValue);
                }}
                
                onChangeActive={(e,newHover)=>{
                    setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{opacity:0.55}} fontSize="inherit" />}
                //onClick={() => StarClick(value, hover)}
                />
                <AutocompleteWrapper>
                <Autocomplete
                id="free-solo-demo"
                freeSolo
                value={autovalue}
                onChange={(event, newValue) =>{
                    if(newValue){
                        setAutovalue(newValue);
                        setInputvalue(newValue);
                    }
                    else{
                        setAutovalue('');
                    }
                }}
                options={inputOptions.map((option : string) => option)}
                renderInput={(params) => <TextField {...params} label="의견도 함께 적어주시면 저희에게 더 큰 도움이 됩니다!" 
                                            onKeyDown={onEnter} value={inputvalue} onChange={onChange} />}
                />
                </AutocompleteWrapper>
                <SubmitButton onClick={onClick}>
                    의견 보내기
                </SubmitButton>
        </RatingWrapper>
        :
        <ResBox>
            <p>소중한 의견 감사합니다!</p>
        </ResBox>
        }
        </>
    )
}
export default RatingStar;