import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button} from "react-bootstrap"
import { UserConsumer, UserProvider } from "../context/UserContext";
import React, { useState } from "react";
import axios from "axios";

const NavBar = () => {
    
    const [user, setUser] = useState({userId : ''});
    const [usdata, setData] = useState({id : -1,
        user : '',
        flag : false});

    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target;

        setUser({...user, [name]: value});
    };
    const fetchvalid = async() =>{
        try{
            const {data} = await axios.post('http://localhost:3001/user/search', user);
            setData(data)
            console.log(data);
            if(data.flag){
                //<UserContext.Provider value = {data}/>
            }
            else{
                alert('Invalid user ID');
                //<UserContext.Provider value = {data}/>

            }
        }
        catch(err){
            console.log(err);
        }
        setUser({userId: ''});
    }
    const onInput = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            fetchvalid();            
        }
    }

    return (
        <>
        <UserConsumer>
            {({userDetails,actions})=>(

            <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
              <Container fluid>
                <Navbar.Brand href="#">RECJOON</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                  <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                  >
                    <Nav.Link href="/">Home</Nav.Link>
                  </Nav>
                  {/* 아래 태그는 원래 div가 아닌 Form이었고, input이 아닌 FormControl이었다 */}
                  <div className="d-flex"  {...usdata.flag ? actions.setUserDetails(usdata) : actions.setUserDetails(userDetails)}>
                    <input
                      name="userId"
                      placeholder="Search"
                      value = {user.userId}
                      onChange={onChange}
                      onKeyPress = {onInput}
                    />
                    <Button variant="outline-success" onClick={fetchvalid} >Search</Button>
                  </div>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            )}
            </ UserConsumer>
        </>
    );
}

export default NavBar;