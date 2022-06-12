import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap"
import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../utils/axios";
import styled from "styled-components";
import UserSearchInputContainer from "../container/userSearchInputContainer";
import { primary_purple } from "../constants/color";
import {useSelector} from 'react-redux';
import { RootState } from "../modules";
import { Modal } from "react-bootstrap";

const StyledNavBar = styled(Navbar)`
  background: ${primary_purple};
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
  font-size: 1.2rem;
  font-weight: 800;
`

const NavBar = ({pathname} : any) => {
  const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
  // console.log(pathname, userHandle)

  const navigate = useNavigate();
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
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
                  {/* <Nav.Link href="/">Home</Nav.Link> href={'/user/' + userHandle}*/}
                  { pathname != undefined ?
                    <Nav.Link onClick={() => navigate(`/user/${userHandle}`)} > 문제 추천 </Nav.Link>:
                    <Nav.Link onClick={handleShow}>문제 추천</Nav.Link> 
                  }
                  { pathname != undefined ?
                    <Nav.Link onClick={() => navigate(`/user/${userHandle}/rival`)}>라이벌 기반 추천</Nav.Link>:
                    <Nav.Link onClick={handleShow}>라이벌 기반 추천</Nav.Link>
                  }
                  {/* <Nav.Link href={pathname === `/user/${userHandle}` ? pathname + '/rival' : `/user/${userHandle}`}>
                  {pathname === `/user/${userHandle}` ? 'Rival' : '문제 추천'}
                    </Nav.Link> */}
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
                { pathname != undefined ? <UserSearchInputContainer /> : <></>}
                
              </Navbar.Collapse>
            </Container>
          </StyledNavBar>
        </div>
        {show &&
          <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>검색창을 이용해주세요.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            검색창에 아이디(handle)를 입력하고 검색 버튼을 누르면 원하는 페이지로 이동할 수 있습니다.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
        }
      </>
    );
}

export default NavBar;