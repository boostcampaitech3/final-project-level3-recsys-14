/* eslint-disable */
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { User } from "../constants/types";
import { useState } from "react";


export type UserContextType = {
    userDetails : User;
    actions : {setUserDetails : Dispatch<SetStateAction<User>>}//(userDetails : User | null | undefined) => void}
};

export const UserContext = createContext<UserContextType>({
    userDetails: {
        user : '',
        flag : false},
    actions : {setUserDetails: () => {}}
});

const UserProvider = ({ children }:{
    children: React.ReactNode
}) => {
    const [userInfo, setUserDetails] = useState({
        user : '',
        flag : false})

    const value = {
        userDetails : userInfo,
        actions : {setUserDetails}
    }
    return (
        <UserContext.Provider value = {value}>{children}</UserContext.Provider>
    )
}

const {Consumer: UserConsumer} = UserContext;

export {UserProvider, UserConsumer}