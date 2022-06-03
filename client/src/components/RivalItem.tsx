import { elementTypeAcceptingRef } from "@mui/utils";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const RivalItemBox = styled.div`
position: relative;
background: white;
box-shadow: 0 0 8px 0 rgba(0,0,0,0.04);

min-height: 150px;

margin: 0 auto;
border-radius: 1rem;

cursor: pointer;
transition: all 0.6s cubic-bezier(.25,.8,.25,1) 0.3s;

`;

const RivalTitle = styled.h3`
    font-size: 1.6rem;
    word-break: keep-all;
`;

const RivalLinkButton = styled.button`
    width: 100%;
    height: 40px;
    border-radius: 20px;
    margin-top: 10px;
    font-weight: 700;
    font-size: 1rem;
    padding: 0 15px;
    letter-spacing: 1.15px;
    background-color: #6539dc;
    color: #f9f9f9;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
`;

const RivalItem = ({rival, onToggle}:any) => {
    // console.log(rival);
    const onClick = () =>{
        onToggle(rival);
    }
    
    return(
//onClick={onToggle(item)}
    <RivalItemBox className='item' onClick={onClick}>
        <div style={{display:'flex', flexDirection: 'column'}}>
            <h2>{rival.handle}</h2>
            <RivalTitle>
                <a href = {`https://solved.ac/profile/${rival.handle}`} target='_blank'> 
                    <RivalLinkButton>
                        라이벌로 등록하러 가기
                    </RivalLinkButton>
                </a>
            </RivalTitle>
        </div>
        {/* {item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)} */}
    </RivalItemBox>
    );
}

export default RivalItem;
