/* eslint-disable */
import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { UserConsumer, UserProvider } from "../context/UserContext";
import { User } from "../constants/types";
import { convertTypeAcquisitionFromJson } from "typescript";

const SearchBlock = styled.input`
    background-color: white
    
`;
const Box = styled.div`

    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    height : 100vh;
`;

function Usersearch() {

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
    return(
            <Box>
                <div>
                    <h1>RECJOON</h1>
                </div>
                <UserConsumer>
                    {({actions})=>(
                        <div>
                            <SearchBlock name = 'userId' placeholder="UserID" onChange={onChange} 
                            value={user.userId} onKeyPress = {onInput} {...actions.setUserDetails(usdata)}/>
                            {/*바로 위에 ...actions.~~에서 왜 ...이 붙어야 하는지 잘 모르겠네*/}
                        </div>
                    )}
                </UserConsumer>
            </Box>
    );
}

export default Usersearch;
