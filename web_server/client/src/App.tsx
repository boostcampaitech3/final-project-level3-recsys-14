/* eslint-disable */

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import {useSelector} from 'react-redux';
import { RootState } from './modules';
// import {Switch} from 'react-router-dom';
import {Usersearch, Userpage, NotFound , Userrival} from './pages'

function App() {
  const userHandle = useSelector((state: RootState) => state.userSearchInput.userHandle);
  // console.log(process.env.REACT_APP_API)
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Usersearch />} />
        <Route path = {`/user/:userHandle`} element={<Userpage />}/>
        <Route path = {`/user/:userHandle/rival`} element = {<Userrival />} />
        <Route path = {"*"} element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
