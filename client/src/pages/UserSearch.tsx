/* eslint-disable */
import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { UserConsumer, UserProvider } from "../context/UserContext";
import { User } from "../constants/types";
import { convertTypeAcquisitionFromJson } from "typescript";
import { API } from "../utils/axios";
import UserSearchInputContainer from "../container/userSearchInputContainer";

const SearchBlock = styled.input`
    background-color: white;
    
`;

const Box = styled.div`

    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    height : 100vh;
`;

function Usersearch() {

    const [user, setUser] = useState({userId : ''});
    const [usdata, setData] = useState({
        user : '',
        flag : false});
    let search_flag = false;
    
    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target;

        setUser({...user, [name]: value});
    };
    const fetchvalid = async() =>{
        try{
            console.log(user)
            const {data} = await API.get(`/user/check?handle=${user.userId}`);
            console.log(data, data.message);

            switch(data.message){
                case `${user.userId} exists.`:
                    console.log(true);
                    search_flag = true;
                    break;

                default:
                    console.log(false);
                    search_flag = false;
                    break;
            }
            setData({user : user.userId, flag : search_flag})
            /* if(data.flag){
                //<UserContext.Provider value = {data}/>
            }
            else{
                alert('Invalid user ID');
                //<UserContext.Provider value = {data}/>

            } */
        }
        catch(err){
            console.log(err);
        }
        setUser({userId: ''});
    }
    const onInput = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            fetchvalid();            
        }
    }
    return(
            <Box>
                <div>
                    <h1>RECJOON</h1>
                </div>
                
                <UserSearchInputContainer />

            </Box>
    );
}

export default Usersearch;
