import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from './UserContext.jsx';
import {Alert, AlertContext} from "./AlertContext.jsx";

const Login = () => {

  // Get the user data, login and related data from the user context provider
  const { user, login } = useContext(UserContext)
  const { error, success } = useContext(AlertContext)

  // Navigate to move between URLs
  const navigate = useNavigate()

  // Keep track of the input forms here
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Set the value of the input field to either username or password.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the login form and attempt to log in.
  const handleSubmit = (e) => {
    e.preventDefault();
    login({username: formData.username, password: formData.password})
  };

  // Navigate to the shop when the logo is clicked. Signed in or not.
  const handleShop = () => {
    navigate('/')
  }

  // Navigate to the shop ('/') if no error and the user is ok
  useEffect(() => {
    if (user !== null && error === '') {
      navigate('/')
    }
  }, [user])

  return (
    <div>
      <Alert/>
      <div>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl" onClick={handleShop}>Web shop</a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-screen">
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input input-bordered input-neutral w-full max-w-xs"
                required
              />
            </div>
            <div className="mb-1">
              <input
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered input-neutral w-full max-w-xs"
                required
              />
            </div>
            <button type="submit" className="btn btn-neutral btn-wide mb-1">Log In</button>
          </form>
          <Link to="/signup" className="btn btn-neutral btn-wide">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
