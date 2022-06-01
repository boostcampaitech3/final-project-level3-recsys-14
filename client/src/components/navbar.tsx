import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap"
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../utils/axios";
import styled from "styled-components";
import UserSearchInputContainer from "../container/userSearchInputContainer";
import { primary_purple } from "./color";
import {useSelector} from 'react-redux';
import { RootState } from "../modules";

const StyledNavBar = styled(Navbar)`
  background: ${primary_purple};
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
  font-size: 1.2rem;
  font-weight: 800;
`

const NavBar = ({pathname} : any) => {
  const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
  console.log(pathname, userHandle)
    return (
        <div>
          <StyledNavBar expand="lg" variant="dark" sticky="top">
            <Container fluid>
              <StyledNavbarBrand href="/">RECJOON</StyledNavbarBrand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: '100px' }}
                  navbarScroll>
                  <Nav.Link href="/">Home</Nav.Link>

                  <Nav.Link href={pathname === `/user/${userHandle}` ? pathname + '/rival' : `/user/${userHandle}`}>
                  {pathname === `/user/${userHandle}` ? 'Rival' : 'MyProfile'}
                    </Nav.Link>
                </Nav>
                {/* 아래 태그는 원래 div가 아닌 Form이었고, input이 아닌 FormControl이었다 */}
                {/* <div className="d-flex"  {...usdata.flag ? actions.setUserDetails(usdata) : actions.setUserDetails(userDetails)}>
                  <input
                    name="userId"
                    placeholder="Search"
                    value = {user.userId}
                    onChange={onChange}
                    onKeyPress = {onInput}
                  />
                  <Button variant="outline-success" onClick={fetchvalid} >Search</Button>
                </div> */}
                <UserSearchInputContainer />
              </Navbar.Collapse>
            </Container>
          </StyledNavBar>
        </div>
    );
}

export default NavBar;