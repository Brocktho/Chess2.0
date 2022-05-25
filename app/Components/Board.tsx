import { useEffect, useState, useReducer } from "react";
import { NetPiece } from "../Pieces/InternetPiece";
import MoveSpot from "~/Pieces/InternetMoveSpot";
import type { Coordinates, InternetBoard, InternetPiece, State, Action} from "~/types";
import invariant from "tiny-invariant";
import type { Socket } from "socket.io-client";
import type { User, GuestUser } from "~/models/user.server";

const updateBoard = (state:State, action:Action) : State => {
  switch(action.type){
    case 'loading':
      return {...state};
    case 'foundPlayer':
      state.player = action.player;
      state.displayPlayer = action.display;
      return {...state};
    case "loadBoard":
      state.whitePieces = action.whitePieces;
      state.blackPieces = action.blackPieces;
      return {...state};
    case "castMoves":
      state.moveBubbles = action.bubbles;
      console.log(state);
      return {...state};
    case "refresh":
      state.moveBubbles = null;
      return {...state};
    case 'error':
      state.displayPlayer = "An error has occured please refresh the page";
      return {...state};
    default:
      return {...state};
  }
}

const ChessBoard = ({
  socket,
  user,
}: {
  socket: Socket | undefined;
  user: User | GuestUser;
}) => {
  const [{
    whitePieces,
    blackPieces,
    turn,
    moveBubbles,
    displayPlayer,
    player,
  }, dispatch] = useReducer(updateBoard, { turn: 1 } );

  const thisWindow = typeof window !== "undefined";
  
  const killCoord : Coordinates = {
    x: -999,
    y: -999,
  };

  const refresh = async () => {
    console.log('refreshing');
    dispatch({type:'refresh'})
  }

  const sendMove = async () => {}

  const receiveAlert = async (piece : InternetPiece) => {
    const moves = piece.moves as Array<Array<Coordinates>>;
    console.log(moveBubbles);
    moveBubbles && await refresh();
    let bubbles = [];
    for ( const outIndex in moves) {
      let moveArray = moves[outIndex];
      for ( const inIndex in moveArray){
        bubbles.push(<MoveSpot
            initialPosition={moveArray[inIndex]}
            thisPiece={piece}
            sendMove={sendMove}
          />
          )
      }
    }
    dispatch({type: "castMoves", bubbles: bubbles});
  }    

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
        socket.on("connection", () => {
          socket.emit("chess", "Chess Board checking in");
          socket.emit("thisPlayer", guest.username);
        });
      } else {
        socket.on("connection", () => {
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
        dispatch({type: "error"});
      } else if (data === 1) {
        dispatch({type: "foundPlayer", player:0, display:"You are playing the White Pieces"});
      } else if (data === 2) {
        dispatch({type: "foundPlayer", player:1, display:"You are playing the Black Pieces"});
      } else {
        dispatch({type:"foundPlayer", player:2, display:"You are spectating"});
      }
    });
    socket.on("boardState", (data : InternetBoard) => {
      let whiteBuffer : Array<JSX.Element> = [];
      data.whitePieces.forEach(pieceArray => {
        pieceArray.forEach( piece => {
          let index;
          if(piece.initial === "p"){
            index = 0;
          }else{
            index = 1;
          }
          const PIECE_CLASS = `w${piece.initial}`;
          whiteBuffer.push(<NetPiece initialPosition={piece.position} pieceClass={PIECE_CLASS} color={0} moves={piece.moves} moveGenerator={piece.moveGenerator} id={piece.id} notifyBoard={receiveAlert}/>)
        });
      });
      let blackBuffer : Array<JSX.Element> = [];
      data.blackPieces.forEach(pieceArray => {
        pieceArray.forEach(piece => {
          const PIECE_CLASS = `b${piece.initial}`;
          console.log(piece.initial);
          blackBuffer.push(<NetPiece initialPosition={piece.position} pieceClass={PIECE_CLASS} color={1} moves={piece.moves} moveGenerator={piece.moveGenerator} id={piece.id} notifyBoard={receiveAlert}/>)
        })
      });
      dispatch({type:"loadBoard", whitePieces: whiteBuffer, blackPieces:blackBuffer});
    });
    socket.on("connectBoard", (data) => {});
  }, [socket]);

  useEffect(() => {}, [turn]);

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
        onClick={async (e) => { await refresh();}}
      >
        {blackPieces}
        {whitePieces}
        {moveBubbles}
      </div>
    </div>
  );
};

export default ChessBoard;
