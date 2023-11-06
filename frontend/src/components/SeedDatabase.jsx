import {useContext, useState} from "react";
import {Alert, AlertContext} from "./AlertContext.jsx";


const SeedDatabase = () => {

  const { setSuccess, setError } = useContext(AlertContext)

  return (
    <div>
      <Alert/>
      <div className="flex flex-col items-center justify-center w-screen">
        <button className="btn btn-wide btn-neutral" onClick={handleGenerateDBData}>Generate database data</button>
      </div>
    </div>
  )
}

export default SeedDatabase;
