import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {useNavigate} from "react-router-dom";
import Cookie from "js-cookie";
import {Alert, AlertContext} from "./AlertContext";
import NotLoggedIn from "./NotLoggedIn";

const Inventory = () => {

  const { setSuccess, setError } = useContext(AlertContext)

  const navigate = useNavigate()

  const { user, logout } = useContext(UserContext);

  const [items, setItems] = useState(null)

  const fetchOwnItems = () => {
    fetch('http://localhost:8080/api/items/own/', {
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
  }

  useEffect(() => {
    fetchOwnItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateItem = (item) => {
    const updatedItems = [...items];
    const itemIndex = updatedItems.findIndex((existingItem) => existingItem.id === item.id);

      // If the item exists in the list, update it
    if (itemIndex === -1) {
      setError('Item does not exist!')
      return
    }

    fetch('http://localhost:8080/api/item/update/', {
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
    fetch('http://localhost:8080/api/item/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify(newItem),
    })
      .then((res) => {
        if (res.ok) return res.json()

        throw new Error('Failed to insert item!')
      })
      .then((item) => {
        fetchOwnItems()
        setSuccess('Item created successfully!')
      })
      .catch((error) => {
        setError(error)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'price' && value < 0) return

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
        <div className="navbar bg-base-100 relative">
          <div className="flex-1">
            <p className="btn btn-ghost normal-case text-xl">Web shop</p>
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
              placeholder="Title"
              id="title"
              name="title"
              value={newItem.title}
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
          <div key={item.id} className="card w-96 bg-base-300/25 text-primary-content relative">
            <div className="card-body">
              <h2 className="card-title text-neutral-content/100">
                {item.title}
                {item.state === 'ON_SALE' && (<div className="absolute top-6 right-6 badge badge-outline badge-secondary">On sale</div>)}
              </h2>
              <p className="text-neutral-content/100">{item.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-neutral-content/60">Added on: {item.dateAdded.split('T')[0]}</div>
                <p className="text-neutral-content/80">{item.price} €</p>
              </div>
              <div className="flex justify-center items-center">
                <button onClick={() => handleUpdateSaleState(item.id, 'ON_SALE')} className="btn btn-neutral mr-1 ml-1">Sell</button>
                <button onClick={() => handleUpdateSaleState(item.id, 'SOLD')} className="btn btn-neutral mr-1 ml-1">Remove from sale</button>
                <div className="dropdown relative">
                  <label tabIndex={0} className="btn btn-neutral">Edit price</label>
                  <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <div className="join">
                        <form className={"w-80"} onSubmit={(e) => handleUpdatePrice(e, item.id)}>
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
