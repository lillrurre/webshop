import {useState} from "react";


const SeedDatabase = () => {

  const [isSuccess, setIsSuccess] = useState(true);
  const [isError, setIsError] = useState(true);

  const handleGenerateDBData = () => {
    setIsSuccess(!isSuccess)
    setIsError(!isError)
  }



  return (
    <div>
      <div className="flex flex-col items-center justify-center w-screen">
        <button className="btn btn-wide btn-neutral" onClick={handleGenerateDBData}>Generate database data</button>
      </div>
      <div className="mt-2">
        {isSuccess && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>The database was successfully migrated</span>
          </div>
        )}
        {isError && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Error! Failed to migrate database</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeedDatabase
