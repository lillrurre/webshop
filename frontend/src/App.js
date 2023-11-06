import {Route, Routes} from 'react-router-dom';
import {UserProvider} from './components/UserContext.jsx';
import {AlertProvider} from './components/AlertContext.jsx';
import React from "react";
import Shop from "./components/Shop";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Inventory from "./components/Inventory";

const App = () => {

  return (
    <div>
      <AlertProvider>
        <UserProvider>
          <Routes>
            <Route path={'/'} element={<Shop />}></Route>
            <Route path={'/login'} element={<Login />}></Route>
            <Route path={'/signup'} element={<Register />}></Route>
            <Route path={'/account'} element={<Account />}></Route>
            <Route path={'/myitems'} element={<Inventory />}></Route>
          </Routes>
        </UserProvider>
      </AlertProvider>
    </div>
  )
};

export default App;