import {useNavigate} from "react-router-dom";


/**
 * NotLoggedIn is used at pages where the user must be authenticated, but is not.
 * @returns {JSX.Element}
 * @constructor
 */
const NotLoggedIn = () => {

  const navigate = useNavigate();

  const handleNotLoggedIn = () => {
    navigate('/login')
  }

  return(
    <div>
      <h1 className="text-4xl mb-8">You are not logged in!</h1>
        <div className="flex flex-col items-center justify-center">
          <button className="btn btn-wide btn-neutral mb-2" onClick={handleNotLoggedIn}>Go to log in</button>
        </div>
    </div>
  )
}

export default NotLoggedIn
