import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import NotLoggedIn from "./NotLoggedIn.jsx";



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


const Inventory = () => {

  const { user } = useContext(UserContext);

  const [items, setItems] = useState([])

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

  //if (user === null) {
  //  return (
  //    <div className="flex flex-col items-center justify-center h-screen">
  //      <NotLoggedIn/>
  //    </div>
  //  )
  //}

  return (
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}

export default Inventory
