import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from './UserContext.jsx';
import {useNavigate} from 'react-router-dom';
import {Alert, AlertContext} from "./AlertContext.jsx";
import Cookie from "js-cookie";

const Shop = () => {

  const { user, logout } = useContext(UserContext)
  const { setSuccess, setError } = useContext(AlertContext)

  const [warning, setWarning] = useState({
    message: '',
    id: 0
  })

  const [items, setItems] = useState([])
  const [cart, setCart] = useState([])

  const navigate = useNavigate()

  const fetchAllItems = () => {
    fetch('http://localhost:8080/api/items/', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
      })
      .catch((error) => {
        console.error('failed to fetch items: ' + error)
      })
  }

  const updateCartPrices = () => {
      if (items && cart && user) {
        const updatedCart = cart.map(cartItem => {
          const matchingItem = items.find(item => item.id === cartItem.id);

          if (matchingItem) {
            // Compare prices and update if necessary
            if (cartItem.price !== matchingItem.price) {
              return {
                ...cartItem,
                price: matchingItem.price,
              };
            }
          }
          // If no matching item is found, keep the cart item as is
          return cartItem;
        });
      setCart(updatedCart);
    }
  };

  useEffect(() => {
    updateCartPrices()
    // eslint-disable-next-line
  }, [warning])

  useEffect(() => {
    fetchAllItems()
  },[])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const handleAddToCart = (item) => {
    if (cart.some((cartItem) => cartItem.id === item.id)) return
    setCart([...cart, item]);
  }

  const handleRemoveFromCart = (item) => {
  if (cart.some((cartItem) => cartItem.id === item.id)) {
    const newCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(newCart);
  }
}

  const handleSearchForItem = (e) => {
    e.preventDefault()
    const searchValue = e.target.elements.search.value;

    // Get all if no search parameter
    if (searchValue === "" || searchValue === null) {
      fetchAllItems()
      return
    }

    fetch(`http://localhost:8080/api/items/${searchValue}/`, {
      method: 'GET',
    })
        .then((res) => res.json())
        .then((data) => {
          setItems(data)
        })
        .catch((error) => console.error(error))
  }

  const handleLogOut = () => (user === null ? navigate('/login') : logout())

  const handleManageAccount = () => {
    navigate('/account')
  }

  const handleInventory = () => {
    navigate('/myitems')
  }

  const handleGenerateDBData = (e) => {
    e.preventDefault()

    // Log out if the user is signed in
    if (user) logout()

    fetch('http://localhost:8080/api/database/populate/', {
      method: 'POST',
    }).then((res) => {
      if (res.ok) {
          setSuccess('Database was successfully populated!')
          fetchAllItems()
        } else {
          setError('Failed to populate database!')
        }
    }).catch((error) => {
      console.error(error)
      setError('Failed to populate database!')
    })
  }

  const handlePay = (e) => {
    e.preventDefault()

    fetch('http://localhost:8080/api/items/purchase/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      body: JSON.stringify(cart),
      credentials: 'include'
    })
        .then((res) => (res.json())
        .then((data) => {
          if (data.error) {
            setWarning({
                message: `Payment failed. This item ${data.error}. Try again!`,
                id: data.id,
            })
            throw new Error(data)
          }
          setItems((items) => {
            return items.map((item) => {
              const updatedItem = data.find((d) => d.id === item.id);
              return updatedItem ? updatedItem : item;
            });
          });
          setCart([])
          setSuccess('Purchase was successful!')
        }).catch((error) => {
          fetchAllItems() // Update the items if it fails
          console.error(error)
          setError('Failed to purchase items!')
          // Update the prices in cart (fix this!)
          updateCartPrices()
        }))
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWarning(null)
    }, 3500)
    return () => clearTimeout(timeout)
  }, [warning])

  return (
    <div>
      <Alert/>
      <div className="flex flex-col h-screen">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <p className="btn btn-ghost normal-case text-xl">Web shop</p>
          </div>
          <div className="flex-none">
            <button onClick={handleGenerateDBData} className="btn btn-neutral ml-1 mr-1">
              Migrate Database
            </button>
            <button onClick={handleInventory} className="btn btn-neutral ml-1 mr-1">
              Inventory
            </button>
            <button onClick={handleManageAccount} className="btn btn-neutral ml-1 mr-1">
              Account
            </button>
            <button onClick={handleLogOut} className="btn btn-neutral ml-1 mr-1">
              {user === null ? 'Go to login' : 'Logout'}
            </button>
            <div className="form-control">
              <form onSubmit={handleSearchForItem}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search for items"
                  className="placeholder-neutral-content/40 input input-bordered border-neutral w-auto input-lg me-4"
                />
              </form>
            </div>
            <details className="dropdown dropdown-end">
              <summary tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span className="badge badge-sm indicator-item">{user && cart.length}</span>
                </div>
              </summary>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-96 bg-base-100 shadow">
                {user && (
                  <div className="card-body">
                    <span className="font-bold text-lg">Items: {cart.length}</span>
                    <span className="text-info">Sum: {cart.reduce((sum, item) => sum + parseFloat(item.price), 0.0)} €</span>
                    <ul>
                      {cart.map((item) => (
                        <li key={item.id} className="flex items-center justify-between mb-1" title={item.description}>
                          <div className="flex items-center">
                            {warning && parseInt(warning.id) === parseInt(item.id) && (
                                <span className="text-warning">{warning.message}</span>
                            )}
                            <span>{item.title}: {item.price} €</span>
                          </div>
                          <button className="btn btn-circle btn-error" onClick={() => handleRemoveFromCart(item)}>X</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={handlePay} className="btn btn-neutral">PAY</button>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
        <div className="flex items-center justify-center h-screen overflow-hidden">
          <div className="container max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                return item.user === user ? null :
                  (<div key={item.id} className="card w-96 bg-base-300/25 text-primary-content">
                      <div className="card shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title text-neutral-content/100">
                            {item.title}
                            <div className="absolute top-6 right-6">{item.owner}</div>
                          </h2>
                          <p className="text-neutral-content/100">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-neutral-content/60">Added on: {item.dateAdded.split('T')[0]}</div>
                            <div className="badge badge-outline badge-secondary">{item.state === 'ON_SALE' ? "For sale" : "Not for sale"}</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-neutral-content/100 text-xl">{item.price} €</p>
                            <button value={item} onClick={() => handleAddToCart(item)} className="btn btn-circle btn-neutral text-xl" disabled={item.state === 'SOLD' || user == null || user === item.user}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop;
