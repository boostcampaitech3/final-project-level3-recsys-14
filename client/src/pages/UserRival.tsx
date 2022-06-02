/* eslint-disable */
import React, { useCallback, useEffect, useState } from "react";

import styled, {css} from "styled-components";
import {ProblemDetail, Rival, RivalDetail} from '../components'
import NavBar from "../components/navbar";
import { useLocation, useParams } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import { API } from "../utils/axios";
import { useNavigate } from "react-router-dom";

import { search } from "../modules/userSearchInput";
import { RootState } from "../modules";
import RivalProblem from "../components/rivalProblem";

function Userrival() {
    const [profile, setProfile] = useState({});

    const params = useParams();
    console.log(params);

    const location = useLocation();

    const dispatch = useDispatch();
    const userHandleDispatch = useCallback((userHandle : string | undefined)=> dispatch(search(userHandle)), [dispatch])


    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const rivalItem = useSelector((state : RootState) => state.rivalItem)
    const rivalProblem = useSelector((state:RootState) => state.rivalProblemItem)
    const tagSwitch = useSelector((state:RootState) => state.tagSwitch.toggle);

    console.log(userHandle);

    let navigate = useNavigate();

    const fetchMyProfile = async() =>{
        try{
            const {data} = await API.get(`/user/show?handle=${params.userHandle}`)
            setProfile(data)
        }
        catch(e){
            console.log(e);
        }
    }

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${params.userHandle}`);
            fetchMyProfile();
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
        userHandleDispatch(params.userHandle);
    }, [params]);

    return(
        <div>
            <NavBar pathname = {location.pathname}/>
            <div style={{display : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection : 'column'}}>
                <RivalDetail rival = {profile} />
                <Rival />
                {rivalItem.toggle && <RivalDetail rival = {rivalItem.rival} />}
                <RivalProblem />
                {rivalProblem.toggle && tagSwitch && <ProblemDetail item = {rivalProblem.item} />}
            </div>
        </div>
    );
}

export default Userrival;