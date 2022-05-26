/* eslint-disable */

import React from 'react';
import logo from './logo.svg';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import { UserContext, UserProvider, UserConsumer } from './context/UserContext';
import { ROUTES } from './constants/route';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <UserConsumer>
          {({userDetails}) => {
            if(userDetails?.flag){
                return <>
                {ROUTES.USER}
                </>
            }
            else{
              return <>
                {ROUTES.SEARCH}
              </>
            }
          }}
        </UserConsumer>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
