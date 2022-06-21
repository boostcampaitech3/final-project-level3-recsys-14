import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Accordion, ListGroup } from "react-bootstrap";
import styled from 'styled-components';
import { 
    almost_black, 
    light_purple, 
    oh_purple,
    light_pink_white,
    dark_purple_blue,
} from '../constants/color';

const StyledAccordion = styled(Accordion)`
    padding: 0 20px;
`;

const StyledAccordionBody = styled(Accordion.Body)`
    height: 350px;
    overflow-y: scroll;
`;

const StyledAccordionButton = styled(Accordion.Button)`
    color: ${almost_black};
    font-weight: 500;

    &:focus {
        border-color: ${light_purple};
        box-shadow: 0 0 0 0.25rem ${light_purple}66;
    }

    &:not(.collapsed) {
        background-color: ${light_pink_white}66;
        color: ${dark_purple_blue};
    }

    &::after {
        background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23595959%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/%3e%3c/svg%3e")!important;
    }

`;

const ProblemListGroup = styled(ListGroup)`
    width: 100%;
    padding: 0 10px;
    cursor: pointer;
`;

const ProblemTitle = styled.h3`
    font-size: 1.2rem;
    margin: 0.5rem;
`;

const ProblemBadge =styled.div`
    display: inline-block;
    font-size: 1rem;
    margin: 0.5rem;
    background-color: ${oh_purple};
    padding: 0.35em 0.65em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 5rem;
`;


const ProblemItemList = (children : any) => {


    return (
        <>
        {children.validAPI ? 
            <StyledAccordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <StyledAccordionButton>추천 문제를 한번에 모아보기 &nbsp;</StyledAccordionButton>
                <StyledAccordionBody>
            <ProblemListGroup as="ol">
                {children.probs.map((item : any, i : number)=>{
                return (
                <ListGroup.Item key={i} as="li" 
                    className="d-flex justify-content-between align-items-start"  
                    onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://www.acmicpc.net/problem/${item.problem_id}`, "_blank");
                    }}>
                    <div className="problem-item">
                        <ProblemTitle>{item.title}</ProblemTitle>
                    </div>
                <ProblemBadge>
                    {item.problem_id}번
                </ProblemBadge>
                </ListGroup.Item>)
                })}
            </ProblemListGroup>
            </StyledAccordionBody>
            </Accordion.Item>
            </StyledAccordion>
            : <></>
        }
        </>
    );
}

export default ProblemItemList;