import {useContext, useState} from 'react';
import NotLoggedIn from "./NotLoggedIn.jsx";
import {UserContext} from "./UserContext.jsx";
import SeedDatabase from "./SeedDatabase.jsx";

const Account = () => {
  const { user } = useContext(UserContext);

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <NotLoggedIn/>
        <SeedDatabase/>
      </div>
    )
  }
  return (
    <div>

    </div>
  )
};

export default Account;
