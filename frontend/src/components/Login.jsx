import {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from './UserContext.jsx';

const Login = () => {

  const { login } = useContext(UserContext)

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({username: 'foo', password: 'bar', email: 'foo.bar@baz.rab'})
    navigate('/')
  };


  return (
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
  );
};

export default Login;
