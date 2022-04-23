import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";
import invariant from "tiny-invariant";

import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { SocketProvider } from "~/context";

import Board from "~/Components/Board";
import Chat from "~/Components/Chat";
import { useOptionalUser } from "~/utils";
import type { GuestUser } from "~/models/user.server";

type LoaderData = {
  socketName: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    invariant(params.slug, "Game Room not found");
    const gameSocket : LoaderData = {
        socketName: params.slug
    }
  return json<LoaderData>(gameSocket);
};

export default function GameRoom() {
  const data = useLoaderData() as LoaderData;
  const [socket, setSocket] = useState<Socket | undefined>();
  const user = useOptionalUser();
  const [guestUser, setGuestUser] = useState<GuestUser>({username: ""});
  const thisWindow = typeof window !== "undefined";
  const quickGuest = useRef<string>();
  
  useEffect( () => {
    const socket = io(`/${data.socketName}`);
    setSocket(socket);
    if(thisWindow){
      if(!user && !localStorage.getItem("guestUser")){
        localStorage.setItem("guestUser", self.crypto.randomUUID());
      }
      let guest = `Guest-${localStorage.getItem("guestUser") as string}`; 
      setGuestUser({
        username: guest,
      })
      quickGuest.current = guest;
    }else{
      if(!user){
        setGuestUser({
          username: "Temporary Guest",
        });
        quickGuest.current = "Temporary Guest";
      }
    }

    socket.emit("thisPlayer", user ? user.username : quickGuest.current);
    return () => {
        socket.close();
    }
  }, [])
  return (
    <SocketProvider socket={socket}>
        <Board socket={socket} user={user ? user : guestUser}/>
        <Chat socket={socket} user={user ? user : guestUser}/>
    </SocketProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
