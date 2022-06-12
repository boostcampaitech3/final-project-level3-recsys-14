import { Navigate, Route, Routes } from 'react-router-dom';
import {Usersearch, Userpage} from '../pages'
import { RootState } from '../modules';
import {useSelector} from 'react-redux';

const UserHandle = () => {
    const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
    return userHandle;
}
const userHandle = UserHandle()
export const ROUTES = {


    SEARCH :
    <Routes>
        <Route path = '/' element={<Usersearch />}/>
        {/* <Route path = "*" element={<Navigate replace to = "/" />}/> */}
    </Routes>,

    USER :

     <Routes>
        <Route path = {`/user/${userHandle}`} element={<Userpage />}/>
        {/* <Route path = "*" element={<Navigate replace to = {`/user/${UserHandle}`} />}/> */}
    </Routes>

}