import {Route, Routes} from 'react-router-dom';
import Login from './components/login.jsx';
import Shop from './components/shop.jsx';
import Signup from './components/Signup.jsx';
import {UserProvider} from './components/UserContext.jsx';

const App = () => {

  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path={'/'} element={<Shop />}></Route>
          <Route path={'/login'} element={<Login />}></Route>
          <Route path={'/signup'} element={<Signup />}></Route>
        </Routes>
      </UserProvider>
    </div>
  )
};

export default App;
