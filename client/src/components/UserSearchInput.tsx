import React, { ChangeEvent, FormEvent, useState } from "react";
import { API } from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import svgIcon from "./svgIcon";
import { useLocation } from "react-router-dom";
import AutoSearch from "./AutoSearch";
import { 
    primary_purple,
    light_purple,
    light_blue,
    light_sky_gray,
    bright_purple,
    deep_purple,
} from "../constants/color";

const UserSearchStyledForm = styled.form`
    /* position: relative; */
    border-radius: 20px;
    padding-right: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 65%;
    min-width: 120px;
    max-width: 720px;
    padding: 6px 6px;
    background-color: #fff;
    box-shadow: 
        0 2px 6px 0 rgba(136,148,171,.2),
        0 24px 20px -24px rgba(71,82,107,.1);
    overflow: hidden;
    @media screen and (max-width: 480px){
        width: 90% !important;
    }
    &:focus {
        box-shadow:
            0 2px 6px 0 rgb(22 10 204 / 20%), 
            0 24px 20px -24px rgb(23 10 119 / 10%);
    }
    @media screen and (max-width: 800px){
        width: 85%;
    }
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

const SearchSelectBox = styled(Form.Select)`
    width: auto;
    font-size: 0.5rem;
    z-index: 10;
    border-radius: 0.8rem;
    &:focus {
        border-color: ${light_purple};
        box-shadow: 0 0 0 0.25rem ${light_purple}66;
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
    const pathname = useLocation().pathname;
    //params.userHandle
    const [userId, setUserId] = useState('');
    const [selectedMenu, setSelected] = useState('problem');
    const [validUserFound, setValidUserFound] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const selectMenu = (e: any) => {
        setSelected(e.target.value);
    }

    let navigate = useNavigate();
    
    const fetchUserCheck = async() =>{
        let userFound = false;
        try{
            const {data} = await API.get(`/user/check?handle=${userId}`);
            console.log(data);
            if (selectedMenu == 'problem'){
                navigate(`/user/${userId}`);
            }
            else {
                navigate(`/user/${userId}/rival`);
            }
            // setValidUserFound(true);
        }
        catch(e){
            handleShow();
            console.log(show)
            console.error(e);  

        }
        console.log(validUserFound);
    }
    
    const onChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    };
    //React.KeyboardEvent<HTMLInputElement>
    const onSubmit = (e : FormEvent) => {
        e.preventDefault();
        fetchUserCheck();

        // onInput(userId);
        // setUserId('');

        // if (selectedMenu == 'problem'){
        //     navigate(`/user/${userId}`);
        // }
        // else {
        //     navigate(`/user/${userId}/rival`);
        // }

        // setUserId('');
    };
    const onEnter = (e : React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter'){
            // onInput(userId);
            // setUserId('');
            fetchUserCheck();
            // if (selectedMenu == 'problem'){
            //     navigate(`/user/${userId}`);
            // }
            // else {
            //     navigate(`/user/${userId}/rival`);
            // }

            // setUserId('');
        }
    }


    return(
        <>
        <UserSearchStyledForm onSubmit={onSubmit}>
            <SearchSelectBox onChange={selectMenu} value={selectedMenu} size="sm">
                <option value="problem">문제 추천</option>
                <option value="rival">라이벌 추천</option>
            </SearchSelectBox>
            <USerSearchStyledInput
                name="userId"
                placeholder="아이디(handle)를 입력하세요."
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

            {/* <AutoSearch /> */}

        </UserSearchStyledForm>

        {show && //추가
            <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>유효한 핸들(handle)을 입력해주세요.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              유저의 핸들이 존재하지 않거나 잘못된 핸들을 입력했습니다.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                닫기
              </Button>
            </Modal.Footer>
          </Modal>
        }
        </>
    );
};

export default UserSearchInput;