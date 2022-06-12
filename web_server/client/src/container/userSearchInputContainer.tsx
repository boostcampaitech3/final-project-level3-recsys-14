import React from "react";
import {useSelector, useDispatch} from 'react-redux';
import { RootState } from "../modules";
import { search } from "../modules/userSearchInput";
import { UserSearchInput } from "../components";

const UserSearchInputContainer = () =>{
    // const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    const dispatch = useDispatch();

    const onInput = (userHandle : string) => {
        dispatch(search(userHandle));
    };

    return (
        <UserSearchInput onInput = {onInput} />
    );
}

export default UserSearchInputContainer;