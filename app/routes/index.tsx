import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import OfflineChessBoard from '~/Components/OfflineChessBoard';
import { useOptionalUser } from "~/utils";




const Chess = () => {
  const user = useOptionalUser();
  const [uniqueGame, setUniqueGame] = useState<string>();

  useEffect( () => {
    if(!localStorage.getItem("guestUser")){
        localStorage.setItem("guestUser", self.crypto.randomUUID());
    }
    console.log(`You are guest: ${localStorage.getItem("guestUser")}`);
    setUniqueGame(self.crypto.randomUUID());
  }, [])
  
    return (
        <div className="min-h-screen bg-slate-800">
            {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                  >
                    View Notes for {user.username}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600  "
                    >
                      Log In
                    </Link>
                  </div>
                )}
            <div className="flex flex-row w-full items-center justify-center">
                {
                uniqueGame && 
                <Link className="p-4 bg-green-500 text-white hover:bg-green-400 cursor-pointer text-center" to={`/play/${uniqueGame}`}> 
                    Start A Game!
                </Link>
                }
                <OfflineChessBoard/>
            </div>
        </div>
    )
}

export default Chess;