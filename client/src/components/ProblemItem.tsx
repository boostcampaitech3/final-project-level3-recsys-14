import { elementTypeAcceptingRef } from "@mui/utils";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const ProblemItemBox = styled.div`
position: relative;
background: white;
box-shadow: 0 0 8px 0 rgba(0,0,0,0.04);

min-height: 150px;

margin: 0 auto;
border-radius: 1rem;

cursor: pointer;
transition: all 0.6s cubic-bezier(.25,.8,.25,1) 0.3s;

`;

const ProblemTitle = styled.h3`
    font-size: 1.6rem;
    word-break: keep-all;
`;

const ProblemLinkButton = styled.button`
    width: 140px;
    height: 40px;
    border-radius: 20px;
    margin-top: 10px;
    font-weight: 700;
    font-size: 1.2rem;
    letter-spacing: 1.15px;
    background-color: #6539dc;
    color: #f9f9f9;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
`;

const ProblemItem = ({item, onToggle}:any) => {
    // console.log(item);
    const onClick = () =>{
        onToggle(item);
    }
    
    return(
//onClick={onToggle(item)}
    <ProblemItemBox className='item' onClick={onClick}>
        <div style={{display:'flex', flexDirection: 'column'}}>
            <ProblemTitle>{item.title}</ProblemTitle>
            <h3>
                <a href = {`https://www.acmicpc.net/problem/${item.problem_id}`} target='_blank'> 
                    <ProblemLinkButton>
                        {item.problem_id}
                    </ProblemLinkButton>
                </a>
            </h3>
        </div>
        {/* {item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)} */}
    </ProblemItemBox>
    );
}

export default ProblemItem;
