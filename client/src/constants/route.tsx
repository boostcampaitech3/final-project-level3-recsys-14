import { Navigate, Route, Routes } from 'react-router-dom';
import {Usersearch, Userpage} from '../pages'
import { UserContext, UserProvider, UserConsumer } from '../context/UserContext';


export const ROUTES = {
    SEARCH :
    <Routes>
        <Route path = '/' element={<Usersearch />}/>
        <Route path = "*" element={<Navigate replace to = "/" />}/>
    </Routes>,

    USER :
    <UserConsumer>
        {({userDetails,actions})=>(
        <Routes>
            <Route path = {`/user/${userDetails.user}`} element={<Userpage />}/>
            <Route path = "*" element={<Navigate replace to = {`/user/${userDetails.user}`} />}/>
        </Routes>
        )}
    </UserConsumer>
}