import React, { createContext, useState } from 'react';

const UserContext = createContext(undefined);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Define functions to set and clear the user when they log in or out.
  const login = (userData) => {
    setUser(userData);
    console.log(user)
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
