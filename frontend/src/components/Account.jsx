import {useContext, useState} from 'react';
import NotLoggedIn from "./NotLoggedIn.jsx";
import {UserContext} from "./UserContext.jsx";
import {useNavigate} from "react-router-dom";
import Cookie from "js-cookie";
import {Alert, AlertContext} from "./AlertContext.jsx";

const Account = () => {

  const {setSuccess, setError} = useContext(AlertContext)

  const { user, logout } = useContext(UserContext);

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  })

  const handleUpdateAccount = (e) => {
    e.preventDefault()

    if (formData.oldPassword === formData.newPassword) {
      setSuccess(false)
      setError('Old and new passwords are the same')
      return
    }

    fetch('http://localhost:8000/api/user/update/', {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          setSuccess('Password updated successfully!')
        } else {
          setError('Failed to update password!')
        }
      })
      .catch((error) => {
        setError('Failed to update password!')
        console.error('ERROR: ' + error)
      })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogOut = () => {
    logout()
    navigate('/login')
  }

  const handleInventory = () => {
    navigate('/myitems')
  }

  const handleShop = () => {
    navigate('/')
  }

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <NotLoggedIn/>
      </div>
    )
  }

  return (
    <div>
      <Alert/>
      <div>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <p className="btn btn-ghost normal-case text-xl">Web shop</p>
          </div>
          <div className="flex-none">
            <button onClick={handleShop}  className="btn btn-neutral ml-1 mr-1">
              Shop
            </button>
            <button onClick={handleInventory} className="btn btn-neutral ml-1 mr-1">
              Inventory
            </button>
            <button onClick={handleLogOut}  className="btn btn-neutral ml-1 mr-1">
              Logout
            </button>
            <div className="form-control">
              <input type="text" placeholder="Search for items" className="placeholder-neutral-content/40 input input-bordered border-neutral w-auto input-lg me-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleUpdateAccount}>
          <div className="flex flex-col items-center justify-center">
            <input
              type="password"
              placeholder="Enter old password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handlePasswordChange}
              className="input input-bordered input-accent mb-1 mt-1"
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handlePasswordChange}
              className="input input-bordered input-accent mb-1 mt-1"
              required
            />
            <button type="submit" className="btn btn-neutral btn-wide mb-1 mt-1">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default Account;
