import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap"
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../utils/axios";
import UserSearchInputContainer from "../container/userSearchInputContainer";

const NavBar = ({pathname, userHandle} : any) => {
  console.log(pathname, userHandle)
    return (
        <>
          <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
            <Container fluid>
              <Navbar.Brand href="/">RECJOON</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: '100px' }}
                  navbarScroll
                >
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
          </Navbar>
        </>
    );
}

export default NavBar;