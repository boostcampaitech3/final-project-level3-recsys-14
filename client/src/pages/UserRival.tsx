/* eslint-disable */
import React, { useCallback, useEffect, useState } from "react";

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

    const userHandleDispatch = useCallback((userHandle : string | undefined)=> dispatch(search(userHandle)), [dispatch])
    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    console.log(userHandle);
    // const RivealItem = 

    let navigate = useNavigate();

    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${params.userHandle}`);
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
                <Rival />
            </div>
        </div>
    );
}

export default Userrival;