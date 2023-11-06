import {createContext, useContext, useState} from 'react';
import PropTypes from "prop-types";
import Cookie from 'js-cookie'
import {AlertContext} from "./AlertContext.jsx";

const UserContext = createContext(undefined);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const { setError } = useContext(AlertContext)

  const login = (userData) => {
    fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    }).then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Log in failed')
    }).then((userData) => {
      setUser(userData)
    }).catch((err) => {
      setError('Username or password is incorrect')
      console.error(err)
    })
  };

  const logout = () => {
    fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        throw new Error('Log out failed')
      }
    }).then(() => {
      setUser(null)
    }).catch(() => {
      setError('Log out failed')
    })
  };

  return (
    <div>
      <UserContext.Provider value={{ user, login, logout }}>
        {children}
      </UserContext.Provider>
    </div>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export { UserContext, UserProvider };
