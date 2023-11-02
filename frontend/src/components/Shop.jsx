import {useContext, useEffect, useState} from 'react';
import {UserContext} from './UserContext.jsx';
import {useNavigate} from 'react-router-dom';


const dummy = [
  {
    id: 1,
    owner: 'user1',
    title: 'Item 1',
    description: 'Description for Item 1',
    price: 10.99,
    dateAdded: '2023-11-01',
    available: true,
  },
  {
    id: 2,
    owner: 'user2',
    title: 'Item 2',
    description: 'Description for Item 2',
    price: 19.99,
    dateAdded: '2023-11-02',
    available: true,
  },
  {
    id: 3,
    owner: 'user3',
    title: 'Item 3',
    description: 'Description for Item 3',
    price: 7.49,
    dateAdded: '2023-11-03',
    available: true,
  },
  {
    id: 4,
    owner: 'user4',
    title: 'Item 4',
    description: 'Description for Item 4',
    price: 15.99,
    dateAdded: '2023-11-04',
    available: false,
  },
];

const Shop = () => {

  const { user, logout } = useContext(UserContext);

  const [items, setItems] = useState([])
  const [cart, setCart] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8080/', {
      method: 'GET',
    })
        .then((res) => res.json())
        .then((data) => {
          setItems({...data})
        })
        .catch((error) => {
          console.error('failed to fetch items: ' + error)
          setItems(dummy) // TODO
        })
  }, [])

  const handleAddToCart = () => {
    setCart(items)
  }

  const handleLogOut = () => {
    logout()
    navigate('/login')
  }

  const handleManageAccount = () => {

  }

  return (
    <div>
      <div>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Web shop</a>
          </div>
            <div className="form-control">
              <input type="text" placeholder="Search for items" className="placeholder-neutral-content/40 input input-bordered border-neutral w-auto input-lg me-4" />
            </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span className="badge badge-sm indicator-item">{cart.length}</span>
                </div>
              </label>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg">Items: {cart.length}</span>
                  <span className="text-info">Sum: {cart.reduce((sum, item) => sum + item.price, 0)}</span>
                  <ul>
                    {items.map((item) => (
                    <li key={item.id}>
                      <div>
                        <a>{item.title}</a>
                        <a>{item.price}</a>
                        <button className="btn btn-circle btn-error">X</button>
                      </div>
                    </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">

                </div>
              </label>
              <ul tabIndex={0} className="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a className="justify-between">
                    {user.email}
                  </a>
                </li>
                <li><button onClick={handleManageAccount}>Account</button></li>
                <li><button onClick={handleLogOut}>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
          <div className="flex items-center justify-center h-screen">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="card w-96 bg-base-300/25 text-primary-content">
            <div className="card shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-neutral-content/100">
                  {item.title}
                    <div className="absolute top-6 right-6">{item.owner}</div>
                </h2>
                <p className="text-neutral-content/100">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-neutral-content/60">Added on: {item.dateAdded}</div>
                  <div className="badge badge-outline badge-secondary">{item.available ? "In stock" : "Out of stock"}</div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-neutral-content/100 text-xl">{item.price} €</p>
                  <button value={item} onClick={handleAddToCart} className="btn btn-circle btn-neutral text-xl">+</button>
                </div>
              </div>
          </div>
        </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Shop;
