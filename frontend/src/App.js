import {Route, Routes} from 'react-router-dom';
import Login from './components/login.jsx';
import Shop from './components/shop.jsx';
import Register from './components/Register.jsx';
import {UserProvider} from './components/UserContext.jsx';
import Account from "./components/Account.jsx";
import Inventory from "./components/Inventory.jsx";
import {AlertProvider} from './components/AlertContext.jsx';

const App = () => {

  return (
    <div>
      <AlertProvider>
        <UserProvider>
          <Routes>
            <Route path={'/'} element={<Shop />}></Route>
            <Route path={'/login'} element={<Login />}></Route>
            <Route path={'/signup'} element={<Register />}></Route>
            <Route path={'/account'} element={<Account />}></Route>
            <Route path={'/myitems'} element={<Inventory />}></Route>
          </Routes>
        </UserProvider>
      </AlertProvider>
    </div>
  )
};

export default App;