import React, { useEffect, useRef, useState } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import styled, { css } from "styled-components";
import { RootState } from "../modules";
import {useSelector, useDispatch} from 'react-redux';

interface Btnprops {
    toggle : boolean;
}

const SwitchButtonWrapper = styled.div`
    display: inline-block;
    vertical-align: middle;
`

const SwitchButton = styled.button<Btnprops>`
  width: 60px;
  height: 30px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  background-color: ${props => (!props.toggle ? "none" : "#6539dc")};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  margin: 0 10px;
`;

const Ball = styled.div<Btnprops>`
  background-color: white;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  position: absolute;
  left: 8%;
  transition: all 0.4s ease-in-out;
  ${props =>
    props.toggle &&
    css`
      transform: translate(30px, 0);
      transition: all 0.5s ease-in-out;
    `}
`
const TagSwitch = ({onTagSwitch} : any) =>{
    const [ isChecked, setIsChecked ] = useState(false);
    const [ show, setShow ] = useState(false);
    
    const problemItem = useSelector((state: RootState) => state.problemItem);
    const rivalProblem = useSelector((state:RootState) => state.rivalProblemItem)
    

    useEffect(()=>{
        if(isChecked == false){
            setShow(true);
            setTimeout(()=>setShow(false), 2000);
        }
    }, [problemItem, rivalProblem])

    // useEffect(()=>{
    //     onTagSwitch(isChecked);
    // }, [])

    const target = useRef(null);
    const onClick = () => {
        setIsChecked((prev) => !prev);
        onTagSwitch();
    };
    const onMouseOver = () => {
        setShow(true)
    }
    const onMouseLeave = () => {
        setShow(false)
    }
    return(
        <SwitchButtonWrapper>
            <SwitchButton
                ref={target}
                toggle = {isChecked}
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
                // checked={/* 리덕스 상태 */}
                // onChange={/* 디스패치*/}
            >

                <Ball toggle = {isChecked} />
            </SwitchButton>
            <Overlay target={target.current} show={show} placement="top">
                {(props) => (
                <Tooltip id="spoiler-tip" {...props}>
                    스위치를 켜면 문제 클릭 시
                    문제에 관한 스포일러를 볼 수 있어요.
                </Tooltip>
                )}
            </Overlay>
            {/* <h4>스포일러 {!isChecked ? "off" : "on"}</h4> */}
        </SwitchButtonWrapper>
    )
}

export default TagSwitch;