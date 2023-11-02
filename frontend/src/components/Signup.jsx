import { useState } from 'react';
import {Link} from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <input
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input input-bordered input-accent w-full max-w-xs"
              required
            />
          </div>
          <div className="mb-1">
            <input
              type="email" // Use email type for the email input
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered input-accent w-full max-w-xs"
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
              className="input input-bordered input-accent w-full max-w-xs"
              required
            />
          </div>
          <button type="submit" className="btn btn-accent btn-wide mb-1">Sign Up</button>
        </form>
        <Link to="/login" className="btn btn-accent btn-wide">Sign In</Link>
      </div>
    </div>
  );
};

export default Signup;
