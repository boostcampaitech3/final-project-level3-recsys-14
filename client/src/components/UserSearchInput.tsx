import React, { ChangeEvent, FormEvent, useState } from "react";
import { API } from "../utils/axios";
import { useNavigate } from "react-router-dom";

const UserSearchInput = ({onInput} : any)=>{
    const [userId, setUserId] = useState('');
    let navigate = useNavigate();
    
    const fetchUserCheck = async() =>{
        try{
            const {data} = await API.get(`/user/check?handle=${userId}`);
            console.log(data);
        }
        catch(e){
            console.error(e);
            alert("Wrong User !");
            navigate('/');
        }
    }
    
    const onChange = (e : ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    };
    //React.KeyboardEvent<HTMLInputElement>
    const onSubmit = (e : FormEvent) => {
        e.preventDefault();
        onInput(userId);
        setUserId('');

        navigate(`/user/${userId}`);
    };
    const onEnter = (e : React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter'){
            onInput(userId);
            setUserId('');
            
            navigate(`/user/${userId}`);
        }
    }


    return(
        <form onSubmit={onSubmit}>
            <input
                name="userId"
                placeholder="User"
                value={userId}
                onChange={onChange}
                onKeyPress = {onEnter}
            />
            <button type="submit">search</button>
        </form>

    );
};

export default UserSearchInput;