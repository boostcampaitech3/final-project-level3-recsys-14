/* eslint-disable */
import React, { useCallback, useEffect, useState, useRef } from "react";

import styled, {css} from "styled-components";
import {Individual, Diverse, ProblemDetail} from '../components'
import NavBar from "../components/navbar";
import {useSelector, useDispatch} from 'react-redux';
import { API } from "../utils/axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { search } from "../modules/userSearchInput";
import { RootState } from "../modules";

const Box = styled.div`
    display : flex;
    z-index : 500;
    background-color: aqua;
`;
const SearchBox = styled.div`
    display : flex;
    z-index : 1000;
    transform : translate(-50%, 0);
`;
const useDidMountEffect = (func : any, deps : any) => {
    const didMount = useRef(false);
    useEffect(()=>{
        if(didMount.current){
            func();
        }else{
            didMount.current = true;
        }
    }, deps);
};

function Userpage() {
    const params = useParams();
    console.log(params); // 첫 번째 userHandle : juk1329, 여섯 번째 userHandle : juk1329

    const location = useLocation();
    // console.log(location.pathname);

    const dispatch = useDispatch();
    const userHandleDispatch = useCallback((userHandle : string | undefined)=> dispatch(search(userHandle)), [dispatch])
    // dispatch(search(params.userHandle));

    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const problemItem = useSelector((state: RootState) => state.problemItem)
    console.log(userHandle); //두 번째 '', 일곱 번째 juk1329

    let navigate = useNavigate();

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${params.userHandle}`);
            console.log(data); //11번째
        }
        catch(e){
            console.error(e);
            alert("Wrong User !");
            navigate('/');
        }
    }

    useEffect(()=>{
        // userHandleDispatch(params.userHandle);
        fetchUserCheck();
        userHandleDispatch(params.userHandle);
    }, [params]);
    
    
    //NavBar 세 번째, 8번쨰
    //individual 네 번째 9번째
    // App 다섯 번째

    return(
        <div>
            <NavBar pathname = {location.pathname}/>
            <div style={{display : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection : 'column'}}>
                <Individual />
            </div>
            {problemItem.toggle && <ProblemDetail item = {problemItem.item}/>}

        </div>
    );
}

export default Userpage;