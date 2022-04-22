import Board from "~/Components/Board";
import Chat from "~/Components/Chat";
import { Link } from "@remix-run/react";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { SocketProvider } from "~/context";
import type { Socket } from "socket.io-client";

import { useOptionalUser } from "~/utils";



const Chess = () => {
  const user = useOptionalUser();
  const [socket, setSocket] = useState<Socket | undefined>();
  
  useEffect( () => {
    const socket = io('/gameduplicate');
    setSocket(socket);
    return () => {
        socket.close();
    }
  }, [])
    return (
        <div className="min-h-screen bg-slate-800">
            {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                  >
                    View Notes for {user.email}
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
            <div>
                We are just getting started! Now! That makes more sense...
            </div>
            <button type="button" onClick={() => socket?.emit("chat message", "other string")}>
          Send ping
        </button>
            <div className="flex flex-row w-full items-center justify-between">
            <SocketProvider socket={socket}>
                <Board socket={socket}/>
                <Chat socket={socket}/>
            </SocketProvider>
            </div>
        </div>
    )
}

export default Chess;