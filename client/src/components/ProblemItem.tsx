import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const ProblemItemBox = styled.div`
position: relative;
background: white;
border-radius: 16px;
box-shadow: 0 0 8px 0 rgba(0,0,0,0.04);

margin: 0 auto;

cursor: pointer;
&:hover {
    color: #6b6eff;
  }
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
            <h3>{item.title}</h3>
            <h2>
                <a href = {`https://www.acmicpc.net/problem/${item.problem_id}`} target='_blank'> {item.problem_id} </a>
            </h2>
        </div>
        {/* {item.tags.split(',').map((tag : string, i : number) => <div key={i}>{tag}</div>)} */}
    </ProblemItemBox>
    );
}

export default ProblemItem;
