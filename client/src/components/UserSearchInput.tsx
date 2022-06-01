import React, { ChangeEvent, FormEvent, useState } from "react";
import { API } from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

import styled from 'styled-components';
import svgIcon from "./svgIcon";
import { 
    primary_purple,
    light_blue,
    light_sky_gray,
    bright_purple,
    deep_purple,
} from "./color";

const UserSearchStyledForm = styled.form`
    border-radius: 20px;
    padding-right: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 60%;
    min-width: 120px;
    max-width: 720px;
    padding: 6px 6px;
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(136,148,171,.2),0 24px 20px -24px rgba(71,82,107,.1);
    overflow: hidden;
`;

const USerSearchStyledInput = styled.input`
    border: none;
    flex: 1;
    outline: none;
    height: 100%;
    padding: 0 20px;
    background-color: #fff;
    color: #323232;
    font-size: min(max(calc(10px + 1vmin), 10px), 18px);
    &:placeholder {
        color: #323232;
        opacity: .6;
    }
`;

const UserSearchStyledButton = styled.button`
    color: #E4EBF5;
    padding: 0;
    border: 0;
    padding: 4px 4px;
    display: flex;
    align-items: center;
    border-radius: 1rem;
    box-shadow:
        inset .2rem .2rem 1rem ${light_blue},
        inset -.2rem -.2rem 1rem ${bright_purple},
        .3rem .3rem .6rem ${light_sky_gray};
    justify-self: center;
    justify-content: center;
    cursor: pointer;
    transition: .3s ease;
    background: ${primary_purple};
    &:hover {
        background-color: ${deep_purple};
    }
`;

const SearchSvgIcon = styled(svgIcon)` 
    width: min(max(calc(10px + 1vmin), 10px), 18px); 
    height: min(max(calc(10px + 1vmin), 10px), 18px);
`;

const UserSearchInput = ({onInput} : any)=>{

    const params = useParams();
    //params.userHandle
    const [userId, setUserId] = useState('');
    let navigate = useNavigate();
    
    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${userId}`);
            console.log(data);
        }
        catch(e){
            console.error(e);
            alert("Wrong User !");
            navigate('/');
        }
    }
    
    const onChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    };
    //React.KeyboardEvent<HTMLInputElement>
    const onSubmit = (e : FormEvent) => {
        e.preventDefault();
        
        // onInput(userId);
        // setUserId('');

        navigate(`/user/${userId}`);
        // setUserId('');
    };
    const onEnter = (e : React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter'){
            // onInput(userId);
            // setUserId('');
            
            navigate(`/user/${userId}`);
            // setUserId('');
        }
    }


    return(
        <UserSearchStyledForm onSubmit={onSubmit}>
            <USerSearchStyledInput
                name="userId"
                placeholder="사용자의 아이디(handle)를 입력하세요."
                value={userId}
                onChange={onChange}
                onKeyPress = {onEnter}
            />
            <UserSearchStyledButton type="submit">
                <SearchSvgIcon 
                    fill='none'
                    stroke='currentColor'
                    viewBox="0 0 28 28"
                    strokeWidth="3">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </SearchSvgIcon>
            </UserSearchStyledButton>
        </UserSearchStyledForm>
    );
};

export default UserSearchInput;