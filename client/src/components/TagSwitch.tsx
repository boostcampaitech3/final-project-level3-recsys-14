import React, { useState } from "react";
import styled, { css } from "styled-components";
interface Btnprops {
    toggle : boolean;
}
const SwitchButton = styled.button<Btnprops>`
  width: 130px;
  height: 50px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  background-color: ${props => (!props.toggle ? "none" : "rgb(51,30,190)")};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;

const Ball = styled.div<Btnprops>`
  background-color: white;
  width: 38px;
  height: 38px;
  border-radius: 50px;
  position: absolute;
  left: 5%;
  transition: all 0.5s ease-in-out;
  ${props =>
    props.toggle &&
    css`
      transform: translate(80px, 0);
      transition: all 0.5s ease-in-out;
    `}
`
const TagSwitch = () =>{
    const [isChecked, setIsChecked] = useState(false);
    const onClick = () =>{
        setIsChecked((prev) => !prev);
    };
    return(
        <div>
            <SwitchButton
                
                toggle = {isChecked}
                onClick={onClick}
                // checked={/* 리덕스 상태 */}
                // onChange={/* 디스패치*/}
            >

                <Ball toggle = {isChecked} />
            </SwitchButton>
            <h4>Tag {!isChecked ? "off" : "on"}</h4>

        </div>
    )
}

export default TagSwitch;