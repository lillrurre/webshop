import React from "react";
import {Router, Route, Routes} from "react-router-dom";
import Login from "./components/login.jsx";
import Shop from "./components/shop.jsx";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<Shop/>}></Route>
        <Route path={"/login"} element={<Login/>}></Route>
      </Routes>
    </div>
  )
};

export default AppRouter;
