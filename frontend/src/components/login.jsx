import {useState} from "react";

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value})
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} >
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
                <button type="submit" className="btn btn-accent btn-wide">Log In</button>
            </form>
        </div>
    )
};

export default Login;
