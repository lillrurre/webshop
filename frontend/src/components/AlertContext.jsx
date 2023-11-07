import {createContext, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

const AlertContext = createContext(undefined);

const AlertProvider = ({ children }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (error || success) {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Set a new timeout to clear the alerts after 3 seconds
      const newTimeoutId = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);

      // Store the timeout ID
      setTimeoutId(newTimeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, success]);

  return (
    <AlertContext.Provider value={{ error, setError, success, setSuccess }}>
      {children}
    </AlertContext.Provider>
  );
};

const Alert = () => {
  const { error, success } = useContext(AlertContext);

  return (
    <div>
      {success !== '' && (
        <div className="alert alert-success absolute">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{success}</span>
        </div>
      )}
      {error !== '' && (
        <div className="absolute alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

AlertProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export { AlertContext, AlertProvider, Alert};
