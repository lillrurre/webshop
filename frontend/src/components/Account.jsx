import { useContext } from 'react';
import { UserContext } from '../UserContext';

const Account = () => {
  const { user } = useContext(UserContext);
  console.log(user)
};

export default Account;
