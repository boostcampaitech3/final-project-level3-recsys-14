/* eslint-disable */
import React, { useState } from "react";
import styled, {css} from "styled-components";
import { UserContext } from "../context/UserContext";
import {Rival, Individual, Diverse} from '../container'
import { UserConsumer, UserProvider } from "../context/UserContext";
import { Navbar, Nav, NavDropdown, FormControl } from "react-bootstrap";
import NavBar from "../components/navbar";

import axios from "axios";

const Box = styled.div`
    display : flex;
    z-index : 500;
    background-color: aqua;
`;
const SearchBox = styled.div`
    display : flex;
    z-index : 1000;
    transform : translate(-50%, 0);
`;

function Userpage() {


    return(
        <UserConsumer>
            {({userDetails,actions})=>(
                <div>
                    <NavBar />
                    <div style={{display : 'flex', justifyContent: 'center', alignItems: 'center', flexDirection : 'column'}}>
                        <Individual />
                        <Rival />
                        <Diverse />
                    </div>
                </div>
            )}
        </UserConsumer>
    );
}

export default Userpage;