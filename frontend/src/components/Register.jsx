import {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AlertContext} from "./AlertContext.jsx";

const Register = () => {

  const { setError, setSuccess } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Registration failed')
        }
        setSuccess('Registration was successful')
        navigate('/login')
      })
      .catch((error) => {
        setError('Registration failed: ' + error)
        console.error(error)
      })
  };

  const handleShop = () => {
    navigate('/')
  }

  return (
    <div>
      <div>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl" onClick={handleShop}>Web shop</a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-screen">
        <div className="register-container">
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
                type="email" // Use email type for the email input
                placeholder="Email"
                id="email"
                name="email"
                value={formData.email}
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
            <button type="submit" className="btn btn-neutral btn-wide mb-1">Register</button>
          </form>
          <Link to="/login" className="btn btn-neutral btn-wide">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
