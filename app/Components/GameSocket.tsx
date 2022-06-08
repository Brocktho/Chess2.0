import { useEffect, useReducer } from "react";
import SocketUpdates from "~/SocketUpdates";

import ChessBoard from "./Board";
import Chat from "./Chat";
import History from "./History";

import type { Coordinates, InternetBoard } from "~/types";
import type { Socket } from "socket.io-client";
import type { IdentifyUser } from "~/models/user.server";

const GameSocket = ({
  socket,
  user,
}: {
  socket: Socket | undefined;
  user: IdentifyUser;
}) => {
  const [{ board, chat, history, displayPlayer, player }, dispatch] =
    useReducer(SocketUpdates, {});

  //separating socket functionality out here for the board, won't be doing that for the chat since the chat isn't too complex of logic

  useEffect(() => {
    if (!socket) return;
    socket.on("chessPlayer", (data) => {
      if (data === 0) {
        dispatch({ type: "error" });
      } else if (data === 1) {
        dispatch({
          type: "foundPlayer",
          player: 0,
          display: "You are playing the White Pieces",
        });
      } else if (data === 2) {
        dispatch({
          type: "foundPlayer",
          player: 1,
          display: "You are playing the Black Pieces",
        });
      } else {
        dispatch({
          type: "foundPlayer",
          player: 2,
          display: "You are spectating",
        });
      }
    });
    socket.on("boardState", (data: InternetBoard) => {});
  }, [socket]);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-4">
        {displayPlayer ? (
          <h1 className="text-white">{displayPlayer}</h1>
        ) : (
          <h1 className="text-white">
            Not Initialized please refresh your browser
          </h1>
        )}
        <ChessBoard />
      </div>
      <div className="flex w-64 flex-col gap-4">
        <History history={[]} />
        <Chat socket={socket} user={user} />
      </div>
    </div>
  );
};

export default GameSocket;
