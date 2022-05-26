import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { SocketProvider } from "~/context";

import GameSocket from "~/Components/GameSocket";
import { useOptionalUser } from "~/utils";
import type { IdentifyUser } from "~/models/user.server";

type LoaderData = {
  socketName: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.slug, "Game Room not found");
  const gameSocket: LoaderData = {
    socketName: params.slug,
  };
  return json<LoaderData>(gameSocket);
};

export default function GameRoom() {
  const DATA = useLoaderData() as LoaderData;
  const [socket, setSocket] = useState<Socket | undefined>();
  const [userIdentifier, setUserIdentifier] = useState<IdentifyUser>({
    username: "",
    identifier: "",
  });
  const USER = useOptionalUser();

  const identifyUser = () => {
    let identifier_string: string;
    if (!localStorage.getItem("guestUser")) {
      identifier_string = self.crypto
        ? self.crypto.randomUUID()
        : `${Math.random() * 123}`;
      localStorage.setItem("guestUser", identifier_string);
    } else {
      identifier_string = localStorage.getItem("guestUser") as string;
    }
    const SOCKET_USER = USER
      ? {
          username: USER.username,
          identifier: `${USER.username}${identifier_string}`,
        }
      : {
          username: "Guest User",
          identifier: `Guest User failure ${identifier_string}`,
        };
    setUserIdentifier(SOCKET_USER);
  };

  useEffect(() => {
    const SOCKET = io(`/${DATA.socketName}`);
    setSocket(SOCKET);
    identifyUser();
    SOCKET.emit("thisPlayer", userIdentifier);
    return () => {
      SOCKET.close();
    };
  }, []);

  return (
    <SocketProvider socket={socket}>
      <GameSocket socket={socket} user={userIdentifier} />
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
