/* eslint-disable */
import React, { useEffect, useState } from "react";

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

function Userpage() {
    const params = useParams();
    console.log(params);

    const location = useLocation();
    console.log(location.pathname);

    const dispatch = useDispatch();
    dispatch(search(params.userHandle));

    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);

    const problemItem = useSelector((state: RootState) => state.problemItem)
    // console.log(problemItem);
    let navigate = useNavigate();

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${userHandle}`);
            console.log(data);
        }
        catch(e){
            console.error(e);
            alert("Wrong User !");
            navigate('/');
        }
    }
    useEffect(()=>{
        fetchUserCheck();
    }, [userHandle]);
    useEffect(()=>{
        
    }, []);
    
    return(
        <div>
            <NavBar userHandle = {userHandle} pathname = {location.pathname}/>
            <div style={{display : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection : 'column'}}>
                <Individual userHandle = {userHandle}/>
            </div>
            {problemItem.toggle && <ProblemDetail item = {problemItem.item}/>}

        </div>
    );
}

export default Userpage;