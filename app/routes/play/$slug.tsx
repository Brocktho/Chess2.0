import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { SocketProvider } from "~/context";

import Board from "~/Components/Board";
import Chat from "~/Components/Chat";

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

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;
  const [socket, setSocket] = useState<Socket | undefined>();
  
  useEffect( () => {
    const socket = io(`/${data.socketName}`);
    setSocket(socket);
    return () => {
        socket.close();
    }
  }, [])
  return (
    <SocketProvider socket={socket}>
        <Board socket={socket}/>
        <Chat socket={socket}/>
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
