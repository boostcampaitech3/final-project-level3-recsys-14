import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState, createRef } from "react";
import { API } from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import svgIcon from "./svgIcon";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { autoUserInitial, autoUserSearch } from "../modules/autoSearch";
import AutoSearch from "./AutoSearch";
import _ from 'lodash';
import { 
    primary_purple,
    light_purple,
    light_blue,
    light_sky_gray,
    bright_purple,
    deep_purple,
} from "../constants/color";
import { Phone, PC } from "../constants/mediaQuery";

const UserSearchWrapper = styled.div`
    width: 60%;
    min-width: 120px;
    max-width: 720px;
    @media screen and (max-width: 480px){
        width: 100%;
        padding: 0 1%;
    }
    @media screen and (min-width: 480px) and (max-width: 800px){
        width: 75%;
    }
    @media screen and (min-width: 800px) and (max-width: 1024px){
        width: 70%;
    }
`;

const UserSearchStyledForm = styled.form`
    position: relative;
    display: block;
    margin: 0 auto;
    border-radius: 20px;
    padding: 6px 8px;
    background-color: #fff;
    box-shadow: 
        0 2px 6px 0 rgba(136,148,171,.2),
        0 24px 20px -24px rgba(71,82,107,.1);
    @media screen and (max-width: 480px){
        width: 100%;
    }
    &:focus {
        box-shadow:
            0 2px 6px 0 rgb(22 10 204 / 20%), 
            0 24px 20px -24px rgb(23 10 119 / 10%);
    }
    
`;

const UserSearchStyledInput = styled.input`
    display: inline-block;
    border: none;
    outline: none;
    width: calc(100% - 120px);
    min-width: 75%;
    height: 100%;
    padding: 0 20px;
    vertical-align: middle;
    background-color: rgba(255, 255, 255, 0);
    color: #323232;
    font-size: min(max(calc(10px + 1vmin), 10px), 18px);
    &:placeholder {
        color: #323232;
        opacity: .6;
    }
    @media screen and (max-width: 480px){
        min-width: 40%;
        padding: 0 5px;
    }
    @media screen and (min-width: 480px) and (max-width: 800px){
        min-width: 65%;
    }
`;

const SearchSelectBox = styled(Form.Select)`
    display: inline-block;
    width: auto;
    font-size: 0.65rem;
    z-index: 10;
    border-radius: 0.8rem;
    &:focus {
        border-color: ${light_purple};
        box-shadow: 0 0 0 0.25rem ${light_purple}66;
    }

`;

const UserSearchStyledButton = styled.button`
    position: absolute;
    right: 10px;
    color: #E4EBF5;
    width: 1.6rem;
    height: 1.6rem;
    padding: 0;
    border: 0;
    border-radius: 1rem;
    box-shadow:
        inset .2rem .2rem 1rem ${light_blue},
        inset -.2rem -.2rem 1rem ${bright_purple},
        .3rem .3rem .6rem ${light_sky_gray};
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
    const location = useLocation();
    //params.userHandle
    const [userId, setUserId] = useState('');
    const [selectedMenu, setSelected] = useState('problem');
    const [validUserFound, setValidUserFound] = useState(false);
    const [show, setShow] = useState(false);

    const [auto, setAuto] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    const autoSearchDispatch = useCallback((handles : Array<any>) => dispatch(autoUserSearch(handles)), [dispatch]);
    const autoSearchInitialDispatch = useCallback(() => dispatch(autoUserInitial()), [dispatch]);
    
    const handleOuterClick = (e:any) => {
        if (!inputRef.current?.contains(e.target)) {
            setAuto(false);
        }
        else {
            setAuto(true);
        }
      };

    useEffect(() => {
        document.addEventListener("click", handleOuterClick)
    }, []);
    
    useEffect(()=>{
        if (location.pathname == `/user/${params.userHandle}/rival`){
            setSelected('rival');
        }
        else {
            setSelected('problem');
        }
    },[location])

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
            // console.log(data);
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
            // console.log(show)
            // console.error(e);  

        }
        // console.log(validUserFound);
    }
    const sendAPI = async (query : string) => {
        if(query.length === 0) {
            autoSearchInitialDispatch();
            setAuto(false);
            return;
        }
        try{
            const {data} = await API.get(`/user/search?handle=${query}`);

            //const userlist = await API.get(`/user/lookup?handles=${data.join()}`)

            autoSearchDispatch(data);
            setAuto(true);
            // console.log(query);
        }catch(e){
            // console.log(e);
        }
        
    }

    const delayedAPICall = useRef(_.debounce((q) => sendAPI(q), 700)).current;

    const onChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
        delayedAPICall(e.target.value);
    };

    //React.KeyboardEvent<HTMLInputElement>
    const onSubmit = (e : FormEvent) => {
        e.preventDefault();
        fetchUserCheck();
    };

    const onEnter = (e : React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter'){
            fetchUserCheck();
        }
    }

    return(
        <UserSearchWrapper>
        <UserSearchStyledForm onSubmit={onSubmit} autoComplete="off">
            <SearchSelectBox onChange={selectMenu} value={selectedMenu} size="sm">
                <option value="problem">문제 추천</option>
                <option value="rival">라이벌 추천</option>
            </SearchSelectBox>
            <Phone>
                <UserSearchStyledInput
                    name="userId"
                    ref={inputRef}
                    placeholder="아이디(handle) 검색"
                    value={userId}
                    onChange={onChange}
                    onKeyPress = {onEnter}
                />
            </Phone>
            <PC>
                <UserSearchStyledInput
                    name="userId"
                    ref={inputRef}
                    placeholder="아이디(handle)를 검색하세요."
                    value={userId}
                    onChange={onChange}
                    onKeyPress = {onEnter}
                />
            </PC>
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
            { auto && <AutoSearch selectedMenu = {selectedMenu}/> }
        </UserSearchStyledForm>
        

        {show &&
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
        </UserSearchWrapper>
    );
};

export default UserSearchInput;