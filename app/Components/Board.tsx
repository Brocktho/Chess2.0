import React, { useEffect, useState, useRef } from "react";
import {WhiteRook, WhiteBishop, WhitePawn, WhiteHorse, WhiteQueen, WhiteKing} from "~/Pieces/InternetWhitePieces";
import {BlackRook, BlackBishop, BlackPawn, BlackHorse, BlackQueen, BlackKing} from "~/Pieces/InternetBlackPieces";
import MoveSpot from "~/Pieces/InternetMoveSpot";
import type { Coordinates, Board, InternetPiece, Notifier, Movement } from "~/types";
import invariant from "tiny-invariant";
import type { Socket } from "socket.io-client";
import type { User, GuestUser } from "~/models/user.server";

const ChessBoard = ({
  socket,
  user,
}: {
  socket: Socket | undefined;
  user: User | GuestUser;
}) => {
  const [player, setPlayer] = useState<number | null>(null);
  const [displayPlayer, setDisplayPlayer] = useState<string | null>(null);
  const [moveBubbles, setMoveBubbles] = useState<Array<JSX.Element> | null>(
    null
  );
  const [turns, setTurns] = useState<number>(1);
  const thisWindow = typeof window !== "undefined";
  const killCoord: Coordinates = {
    x: -999,
    y: -999,
  };

  const refreshDom = async () => {
    setMoveBubbles(null);
  };

  const receiveAlert = async (piece : InternetPiece) => {
      await refreshDom();
      let moves = piece.moves as Array<Coordinates>;
      let bubbles = moves.map((move) => {
        return (
          <MoveSpot
            initialPosition={move}
            thisPiece={piece}
            sendMove={sendMove}
          />
        );
      });
    }

  const blackPieces = Array.apply(null, Array(2)).map((a, y) => {
    return Array.apply(null, Array(8)).map((b, x) => {
      let thisPosition: Coordinates = {
        x: x,
        y: y,
      };
      switch (y) {
        case 1:
          return (
            <BlackPawn
              initialPosition={thisPosition}
              notifyBoard={receiveAlert}
              key={`BlackPawn${x}`}
            />
          );
        case 0:
          switch (x) {
            case 0:
              return (
                <BlackRook
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackRook${x}`}
                />
              );
            case 1:
              return (
                <BlackHorse
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackHorse${x}`}
                />
              );
            case 2:
              return (
                <BlackBishop
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackBishop${x}`}
                />
              );
            case 3:
              return (
                <BlackQueen
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackQueen${x}`}
                />
              );
            case 4:
              return (
                <BlackKing
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackKing${x}`}
                />
              );
            case 5:
              return (
                <BlackBishop
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackBishop${x}`}
                />
              );
            case 6:
              return (
                <BlackHorse
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackHorse${x}`}
                />
              );
            case 7:
              return (
                <BlackRook
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackRook${x}`}
                />
              );
            default:
              return (
                <BlackPawn
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`BlackPawn${x}`}
                />
              );
          }
        default:
          return (
            <BlackPawn
              initialPosition={thisPosition}
              notifyBoard={receiveAlert}
              key={`BlackPawn${x}`}
            />
          );
      }
    });
  });

  const whitePieces = Array.apply(null, Array(2)).map((a, y) => {
    return Array.apply(null, Array(8)).map((b, x) => {
      let thisPosition: Coordinates = {
        x: x,
        y: y + 6,
      };
      switch (y) {
        case 0:
          return (
            <WhitePawn
              initialPosition={thisPosition}
              notifyBoard={receiveAlert}
              key={`WhitePawn${x}`}
            />
          );
        case 1:
          switch (x) {
            case 0:
              return (
                <WhiteRook
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteRook${x}`}
                />
              );
            case 1:
              return (
                <WhiteHorse
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteHorse${x}`}
                />
              );
            case 2:
              return (
                <WhiteBishop
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteBishop${x}`}
                />
              );
            case 3:
              return (
                <WhiteQueen
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteQueen${x}`}
                />
              );
            case 4:
              return (
                <WhiteKing
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteKing${x}`}
                />
              );
            case 5:
              return (
                <WhiteBishop
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteBishop${x}`}
                />
              );
            case 6:
              return (
                <WhiteHorse
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteHorse${x}`}
                />
              );
            case 7:
              return (
                <WhiteRook
                  initialPosition={thisPosition}
                  notifyBoard={receiveAlert}
                  key={`WhiteRook${x}`}
                />
              );
          }
      }
    });
  });

  useEffect(() => {
    if (!socket) return;
    if (thisWindow) {
      if (!user && !localStorage.getItem("guestUser")) {
        localStorage.setItem("guestUser", self.crypto.randomUUID());
        let guest = localStorage.getItem("guestUser") as string;
        let user: GuestUser = {
          username: guest,
        };
      }
    } else {
      if (!user) {
        let guest: GuestUser = {
          username: "Temporary User",
        };
        socket.on("connection", (data) => {
          socket.emit("chess", "Chess Board checking in");
          socket.emit("thisPlayer", guest.username);
        });
      } else {
        socket.on("connection", (data) => {
          socket.emit("chess", "Chess Board checking in");
          socket.emit("thisPlayer", user.username);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("chessPlayer", (data) => {
      if (data === 0) {
        setDisplayPlayer("An error has occured, please refresh your page.");
      } else if (data === 1) {
        setDisplayPlayer("You are playing the White Pieces");
      } else if (data === 2) {
        setDisplayPlayer("You are playing the Black Pieces");
      } else {
        setDisplayPlayer("You are spectating");
      }
      setPlayer(data);
    });

    socket.on("connectBoard", (data) => {});
  }, [socket]);

  useEffect(() => {}, [turns]);

  return (
    <div className="flex flex-col gap-2">
      {displayPlayer ? (
        <h1 className="text-white">{displayPlayer}</h1>
      ) : (
        <h1 className="text-white">
          Not Initialized please refresh your browser
        </h1>
      )}
      <div
        className="board bg-slate-800"
        onClick={async (e) => await refreshDom()}
      >
        {blackPieces}
        {whitePieces}
        {moveBubbles}
      </div>
    </div>
  );
};

export default ChessBoard;
