/* eslint-disable */
import React, { useEffect, useState } from "react";

import styled, {css} from "styled-components";
import {Rival} from '../components'
import NavBar from "../components/navbar";
import { useLocation, useParams } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import { API } from "../utils/axios";
import { useNavigate } from "react-router-dom";

import { search } from "../modules/userSearchInput";
import { RootState } from "../modules";

function Userrival() {
    const params = useParams();
    console.log(params);

    const location = useLocation();

    const dispatch = useDispatch();

    dispatch(search(params.userHandle));
    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);

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

    return(
        <div>
            <NavBar  userHandle = {userHandle} pathname = {location.pathname}/>
            <div style={{display : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection : 'column'}}>
                <Rival userHandle = {userHandle}/>
            </div>
        </div>
    );
}

export default Userrival;