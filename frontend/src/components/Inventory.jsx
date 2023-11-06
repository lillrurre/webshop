import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import NotLoggedIn from "./NotLoggedIn.jsx";
import {useNavigate} from "react-router-dom";
import Cookie from "js-cookie";
import {Alert, AlertContext} from "./AlertContext.jsx";

const Inventory = () => {

  const { setSuccess, setError } = useContext(AlertContext)

  const navigate = useNavigate()

  const { user, logout } = useContext(UserContext);

  const [items, setItems] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/items/own/', {
      method: 'GET',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      credentials: 'include',
    })
    .then((res) => res.json())
    .then((data) => {
      setItems(data)
    })
    .catch((error) => {
      setError('Failed to get own items!')
      console.error('failed to fetch items: ' + error)
    })
  }, [])

  const updateItem = (item) => {
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((existingItem) => existingItem.id === item.id);

      // If the item exists in the list, update it
    if (itemIndex === -1) {
      setError('Item does not exist!')
      return
    }

    fetch('http://localhost:8000/api/item/update', {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((item) => {
        updatedItems[itemIndex] = item;
        setItems(updatedItems)
      })
      .catch((error) => console.error(error))
  }

  const handleUpdatePrice = (e, id) => {
    e.preventDefault();
    const item = items.find((item) => item.id === id)
    item.price = parseFloat(e.target.elements.price.value)
    updateItem(item)
  }


  const handleUpdateSaleState = (id, state) => {
    const item = items.find((item) => item.id === id)
    item.state = state
    updateItem(item)
  }

  const [newItem, setNewItem] = useState(
    {
      name: '',
      price: 0.0,
      description: ''
    }
  )

  const handleAddItem = (e) => {
    e.preventDefault()
    fetch('http://localhost:8000/api/item/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify(newItem),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Failed to insert item!')
      })
      .then((item) => {
        setItems([...items, item])
        setSuccess('Item created successfully!')
      })
      .catch((error) => {
        setError(error)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'price' && value < 0) {
      return
    }
    setNewItem({ ...newItem, [name]: value })
  };

  const handleLogOut = () => {
    logout()
    navigate('/login')
  }

  const handleManageAccount = () => {
    navigate('/account')
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
            <a className="btn btn-ghost normal-case text-xl">Web shop</a>
          </div>
          <div className="flex-none">
            <button onClick={handleShop}  className="btn btn-neutral ml-1 mr-1">
              Shop
            </button>
            <button onClick={handleManageAccount} className="btn btn-neutral ml-1 mr-1">
              Account
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
    <div className="flex items-center justify-center h-screen">
      <div className="absolute bottom-6 right-6">
        <form onSubmit={handleAddItem}>
          <div className="mb-1">
            <input
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              className="input input-bordered input-neutral w-full max-w-xs"
              required
            />
          </div>
          <div className="mb-1">
            <input
              type="number"
              placeholder="Price"
              id="price"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              className="input input-bordered input-neutral w-full max-w-xs"
              required
            />
          </div>
          <div className="mb-1">
            <input
              type="text"
              placeholder="Description"
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              className="input input-bordered input-neutral w-full max-w-xs"
              required
            />
          </div>
          <button type="submit" className="btn btn-neutral btn-wide mb-1">Create Item</button>
        </form>
      </div>
      <div className="container max-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{items?.map((item) => (
          <div key={item.id} className="card w-96 bg-base-300/25 text-primary-content">
            <div className="card-body">
              <h2 className="card-title text-neutral-content/100">
                {item.title}
                {item.state === 'NONE' ? null : (<div className="absolute top-6 right-6 badge badge-outline badge-secondary">{item.state}</div>)}
              </h2>
              <a className="text-neutral-content/100">{item.description}</a>
              <div className="flex justify-between items-center">
                <div className="text-neutral-content/60">Added on: {item.dateAdded.split('T')[0]}</div>
                <a className="text-neutral-content/80">{item.price} €</a>
              </div>
              <div className="flex justify-center items-center">
                <button onClick={() => handleUpdateSaleState(item.id, 'ON_SALE')} className="btn btn-neutral mr-1 ml-1" disabled={item.state === 'SOLD'}>Sell</button>
                <button onClick={() => handleUpdateSaleState(item.id, 'NONE')} className="btn btn-neutral mr-1 ml-1" disabled={item.state === 'SOLD'}>Remove from sale</button>
                <div className="dropdown">
                  <label tabIndex={0} className="btn btn-neutral mr-1 ml-1" disabled={item.state === 'SOLD'}>Edit price</label>
                  <ul tabIndex={0} className="p-2 menu dropdown-content z-[1] bg-transparent rounded-box w-52">
                    <li>
                      <div className="join">
                        <form onSubmit={ (e) => handleUpdatePrice(e, item.id)}>
                          <input type="number" name="price" placeholder={item.price + " €"} min="0" required className="input input-bordered join-item text-white"/>
                          <button type="submit" className="btn btn-neutral join-item rounded-r-full">Update</button>
                        </form>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
    </div>
  )
}


export default Inventory
