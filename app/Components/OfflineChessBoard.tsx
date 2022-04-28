import React, { useEffect, useState, useRef } from "react";
import WhiteRook from "~/Pieces/WhiteRook";
import WhiteHorse from "~/Pieces/WhiteHorse";
import WhiteBishop from "~/Pieces/WhiteBishop";
import WhiteQueen from "~/Pieces/WhiteQueen";
import WhiteKing from "~/Pieces/WhiteKing";
import WhitePawn from "~/Pieces/WhitePawn";
import BlackRook from "~/Pieces/BlackRook";
import BlackHorse from "~/Pieces/BlackHorse";
import BlackBishop from "~/Pieces/BlackBishop";
import BlackQueen from "~/Pieces/BlackQueen";
import BlackKing from "~/Pieces/BlackKing";
import BlackPawn from "~/Pieces/BlackPawn";
import MoveSpot from "~/Pieces/MoveSpot";
import type { Coordinates, Board, Piece, Notifier, Movement } from "~/types";
import invariant from "tiny-invariant";

const OfflineChessBoard = () => {
  const [player, setPlayer] = useState<number | null>(null);
  const [inCheck, setInCheck] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moveBubbles, setMoveBubbles] = useState<Array<JSX.Element> | null>(
    null
  );
  const [turns, setTurns] = useState<number>(1);
  const [displayPlayer, setDisplayPlayer] = useState<string | null>(null);

  const boardState = useRef<Board | null>(null);
  const killCoord: Coordinates = {
    x: -999,
    y: -999,
  };

  const lastMove = useRef<Movement>({
    endPosition: killCoord,
    special: false,
    initial: "none",
    color: 2,
  });

  const refreshDom = async () => {
    setMoveBubbles(null);
  };

  const checkKing = () => {
    if (turns % 2 === 0) {
      invariant(boardState.current, "must be true");
      let kingPos = boardState.current.whitePieces[1][4].position;
      let kingMap = kingPos.y * 8 + kingPos.x;
      if (boardState.current.blackAttacks.includes(kingMap)) {
        setInCheck(true);
      }
    }
  };

  const xToString = (x: number) => {
    switch (x) {
      case 0:
        return "a";
      case 1:
        return "b";
      case 2:
        return "c";
      case 3:
        return "d";
      case 4:
        return "e";
      case 5:
        return "f";
      case 6:
        return "g";
      default:
        return "h";
    }
  };

  const generatePositionMap = async () => {
    invariant(boardState.current);
    boardState.current.attackOnWk = [];
    boardState.current.attackOnBk = [];
    boardState.current.whitePieces.forEach(
      (pieces: Array<Piece>, index: number) => {
        pieces.forEach((piece: Piece) => {
          if (piece.alive) {
            invariant(boardState.current, "bruh");
            let pieceMap = piece.position.y * 8 + piece.position.x;
            if (!boardState.current.whitePositions.includes(pieceMap)) {
              boardState.current.whitePositions.push(pieceMap);
            }
            let moves: Array<Array<Coordinates>> = piece.generateMoves();
            moves.forEach((moveSet) => {
              invariant(boardState.current, "aufhiueafhewui");
              let isRelevant = false;
              let finalIndex = 0;
              moveSet.every((move, index) => {
                let coordMap = move.y * 8 + move.x;
                invariant(boardState.current, "how many times");
                if (boardState.current.blackKing === coordMap) {
                  isRelevant = true;
                  finalIndex = index;
                  return false;
                }
                return true;
              });
              if (isRelevant) {
                boardState.current.attackOnBk.push(
                  moveSet.slice(0, finalIndex)
                );
              }
            });
          } else {
          }
        });
      }
    );
    boardState.current.blackPositions = [];
    boardState.current.blackPieces.forEach((pieces: Array<Piece>) => {
      pieces.forEach((piece: Piece) => {
        if (piece.alive) {
          invariant(boardState.current, "bruh");
          boardState.current.blackPositions.push(
            piece.position.y * 8 + piece.position.x
          );
          let moves: Array<Array<Coordinates>> = piece.generateMoves();
          moves.forEach((moveSet) => {
            invariant(boardState.current, "aufhiueafhewui");
            let isRelevant = false;
            let finalIndex = 0;
            moveSet.every((move, index) => {
              let coordMap = move.y * 8 + move.x;
              invariant(boardState.current, "how many times");
              if (boardState.current.whiteKing === coordMap) {
                isRelevant = true;
                finalIndex = index;
                return false;
              }
              return true;
            });
            if (isRelevant) {
              boardState.current.attackOnWk.push(moveSet.slice(0, finalIndex));
            }
          });
        }
      });
    });
    boardState.current.whitePieces.forEach((pieces: Array<Piece>) => {
      pieces.forEach((piece: Piece) => {
        if (piece.alive) {
          let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
          let trueMoves: Array<number> = [];
          let possibleAttacks: Array<Coordinates> = [];
          if (piece.generateAttacks) {
            possibleAttacks = piece.generateAttacks();
          }
          possibleMoves.forEach((chunk: Array<Coordinates>) => {
            chunk.every((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (!boardState.current.whitePositions.includes(pieceMap)) {
                if (piece.initial === "p") {
                  if (!boardState.current.blackPositions.includes(pieceMap)) {
                    trueMoves.push(pieceMap);
                    return true;
                  } else {
                    return false;
                  }
                }
                if (boardState.current.blackPositions.includes(pieceMap)) {
                  trueMoves.push(pieceMap);
                  return false;
                }
                trueMoves.push(pieceMap);
                return true;
              } else {
                return false;
              }
            });
          });
          if (piece.initial === "p") {
            possibleAttacks.forEach((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (boardState.current.blackPositions.includes(pieceMap)) {
                trueMoves.push(pieceMap);
              }
            });
          }
          trueMoves.forEach((move) => {
            invariant(boardState.current, "i swear");
            boardState.current.whiteAttacks.push(move);
          });
        }
      });
    });
    boardState.current.blackPieces.forEach((pieces: Array<Piece>) => {
      pieces.forEach((piece: Piece) => {
        let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
        let trueMoves: Array<number> = [];
        let possibleAttacks: Array<Coordinates> = [];
        if (piece.alive) {
          if (piece.generateAttacks) {
            possibleAttacks = piece.generateAttacks();
          }
          possibleMoves.forEach((chunk: Array<Coordinates>) => {
            chunk.every((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (!boardState.current.blackPositions.includes(pieceMap)) {
                if (piece.initial === "p") {
                  if (!boardState.current.whitePositions.includes(pieceMap)) {
                    trueMoves.push(pieceMap);
                    return true;
                  } else {
                    return false;
                  }
                }
              }
            });
          });
          if (piece.initial === "p") {
            possibleAttacks.forEach((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (boardState.current.whitePositions.includes(pieceMap)) {
                trueMoves.push(pieceMap);
              }
            });
          }
        }
        trueMoves.forEach((move) => {
          invariant(boardState.current, "i swear");
          boardState.current.blackAttacks.push(move);
        });
      });
    });
  };

  const returnCaptureBlack = async (coordMap : number) => {
    boardState.current?.blackPieces.every( (pieces, y)  => {
      pieces.every( (piece, x) => {
        let attackMap = ( piece.position.y * 8 ) + piece.position.x;
        console.log(piece);
        console.log(attackMap);
        if( !(attackMap === coordMap) ){
          return true;
        }else{
          console.log("found piece:");
          piece.alive = false;
          piece.update(killCoord);
          piece.position = killCoord;
          let remove = boardState.current?.blackPositions.indexOf(attackMap) as number;
          boardState.current?.blackPositions.splice(remove,1);
          boardState.current?.blackPieces[y].splice(x,1);
          return false;
        }
      });
      return true;
    });
  }

  const returnCaptureWhite = async (coordMap : number) => {
    boardState.current?.whitePieces.every( (pieces, y)  => {
      pieces.every( (piece, x) => {
        let attackMap = ( piece.position.y * 8 ) + piece.position.x;
        if( !(attackMap === coordMap) ){
          return true;
        }else{
          piece.alive = false;
          piece.update(killCoord);
          piece.position = killCoord;
          let remove = boardState.current?.whitePositions.indexOf(attackMap) as number;
          boardState.current?.whitePositions.splice(remove,1);
          boardState.current?.whitePieces[y].splice(x,1);
          return false;
        }
      });
      return true;
    });
  }

  const registerPiece = (piece: Piece) => {
    let color = piece.color;
    if (boardState.current === null) {
      let newBoard: Board = {
        whiteKing: 60,
        blackKing: 4,
        attackOnWk: [],
        attackOnBk: [],
        whiteAttacks: [],
        blackAttacks: [],
        whitePositions: [],
        blackPositions: [],
        whitePieces: [],
        blackPieces: [],
      };
      boardState.current = newBoard;
    }
    if (color === 0) {
      if (piece.arrayLocation.x === 0) {
        boardState.current.whitePieces.push([]);
        boardState.current.whitePieces[piece.arrayLocation.y].push(piece);
      } else {
        boardState.current.whitePieces[piece.arrayLocation.y].push(piece);
      }
      boardState.current.whitePositions.push(
        piece.position.y * 8 + piece.position.x
      );
    }
    if (color === 1) {
      if (piece.arrayLocation.x === 0) {
        boardState.current.blackPieces.push([]);
        boardState.current.blackPieces[piece.arrayLocation.y].push(piece);
      } else {
        boardState.current.blackPieces[piece.arrayLocation.y].push(piece);
      }
      boardState.current.blackPositions.push(
        piece.position.y * 8 + piece.position.x
      );
    }
  };

  const generateWhitePieceMoves = (piece: Piece) => {
    if (piece.color === 0 && turns % 2 === 1) {
      if (piece.initial === "k") {
        let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
        let trueMoves: Array<Coordinates> = [];
        possibleMoves.forEach((chunk: Array<Coordinates>) => {
          chunk.every((coord: Coordinates) => {
            invariant(boardState.current, "board exists");
            let pieceMap = coord.y * 8 + coord.x;
            if (!boardState.current.whitePositions.includes(pieceMap)) {
              if (boardState.current.blackAttacks.includes(pieceMap)) {
                return false;
              }
              if (boardState.current.blackPositions.includes(pieceMap)) {
                trueMoves.push(coord);
                return false;
              }
              trueMoves.push(coord);
              return true;
            } else {
              return false;
            }
          });
        });
        return trueMoves;
      } else {
        if (piece.alive) {
          let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
          let trueMovesBuffer: Array<Coordinates> = [];
          let trueMoves: Array<Coordinates> = [];
          let piecePosition = piece.position.y * 8 + piece.position.x;

          possibleMoves.forEach((chunk: Array<Coordinates>) => {
            chunk.every((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (Array.isArray(boardState.current.attackOnWk[0])) {
                let criticalPiece = false;
                let blockerList : Array<number> = [];
                boardState.current.attackOnWk.forEach((attackVectors) => {
                  attackVectors.forEach((attackMove) => {
                    let blockers = 0;
                    let attackMap = attackMove.y * 8 + attackMove.x;
                    if(boardState.current?.whitePositions.includes(attackMap)){
                      blockers++;
                    }
                    if (attackMap === pieceMap) {
                      trueMovesBuffer.push(coord);
                    }
                    if (attackMap === piecePosition) {
                      criticalPiece = true;
                      blockers++;
                    }
                  });
                });
                if (criticalPiece && Math.min(...blockerList) < 2) {
                  return false;
                }
              }

              if (!boardState.current.whitePositions.includes(pieceMap)) {
                if (piece.initial === "p") {
                  if (!boardState.current.blackPositions.includes(pieceMap)) {
                    trueMoves.push(coord);
                    return true;
                  } else {
                    return false;
                  }
                }
                if (boardState.current.blackPositions.includes(pieceMap)) {
                  trueMoves.push(coord);
                  return false;
                }
                trueMoves.push(coord);
                return true;
              } else {
                return false;
              }
            });
          });
          trueMovesBuffer.forEach((coord: Coordinates) => {
            let pieceMap = coord.y * 8 + coord.x;
            if (!boardState.current?.whitePositions.includes(pieceMap)) {
              if (piece.initial === "p") {
                if (!boardState.current?.blackPositions.includes(pieceMap)) {
                  trueMoves.push(coord);
                  return true;
                } else {
                  return false;
                }
              }
              if (boardState.current?.blackPositions.includes(pieceMap)) {
                trueMoves.push(coord);
                return false;
              }
              trueMoves.push(coord);
              return true;
            } else {
              return false;
            }
          });
          if (piece.initial === "p") {
            let possibleAttacks: Array<Coordinates> = [];
            if (piece.generateAttacks) {
              possibleAttacks = piece.generateAttacks();
            }
            possibleAttacks.forEach((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (boardState.current.blackPositions.includes(pieceMap)) {
                trueMoves.push(coord);
              }
              if (lastMove.current.color === 1 && lastMove.current.special) {
                if (lastMove.current.endPosition.y === coord.y + 1) {
                  if (lastMove.current.endPosition.x === coord.x) {
                    trueMoves.push(coord);
                  }
                }
              }
            });
          }
          return trueMoves;
        }
        return [];
      }
    }
  };

  const generateBlackPieceMoves = (piece: Piece) => {
    if (piece.color === 1) {
      if (piece.initial === "k") {
        let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
        let trueMoves: Array<Coordinates> = [];
        possibleMoves.forEach((chunk: Array<Coordinates>) => {
          chunk.every((coord: Coordinates) => {
            invariant(boardState.current, "board exists");
            let pieceMap = coord.y * 8 + coord.x;
            if (!boardState.current.blackPositions.includes(pieceMap)) {
              if (boardState.current.whiteAttacks.includes(pieceMap)) {
                return false;
              }
              if (boardState.current.whitePositions.includes(pieceMap)) {
                trueMoves.push(coord);
                return false;
              }
              trueMoves.push(coord);
              return true;
            } else {
              return false;
            }
          });
        });
        return trueMoves;
      } else {
        if (piece.alive) {
          let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
          let trueMovesBuffer: Array<Coordinates> = [];
          let trueMoves: Array<Coordinates> = [];
          let piecePosition = piece.position.y * 8 + piece.position.x;
          possibleMoves.forEach((chunk: Array<Coordinates>) => {
            chunk.every((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (Array.isArray(boardState.current.attackOnBk[0])) {
                let criticalPiece = false;
                boardState.current.attackOnBk.forEach((attackVectors) => {
                  attackVectors.forEach((attackMove) => {
                    let attackMap = attackMove.y * 8 + attackMove.x;
                    if (attackMap === pieceMap) {
                      trueMovesBuffer.push(coord);
                    }
                    if (attackMap === piecePosition) {
                      criticalPiece = true;
                    }
                  });
                });
                if (criticalPiece) {
                  return false;
                }
              }
              if (!boardState.current.blackPositions.includes(pieceMap)) {
                if (piece.initial === "p") {
                  if (!boardState.current.whitePositions.includes(pieceMap)) {
                    trueMoves.push(coord);
                    return true;
                  } else {
                    return false;
                  }
                }
                if (boardState.current.whitePositions.includes(pieceMap)) {
                  trueMoves.push(coord);
                  return false;
                }
                trueMoves.push(coord);
                return true;
              } else {
                return false;
              }
            });
          });
          trueMovesBuffer.forEach((coord: Coordinates) => {
            let pieceMap = coord.y * 8 + coord.x;
            if (!boardState.current?.blackPositions.includes(pieceMap)) {
              if (piece.initial === "p") {
                if (!boardState.current?.whitePositions.includes(pieceMap)) {
                  trueMoves.push(coord);
                  return true;
                } else {
                  return false;
                }
              }
              if (boardState.current?.whitePositions.includes(pieceMap)) {
                trueMoves.push(coord);
                return false;
              }
              trueMoves.push(coord);
              return true;
            } else {
              return false;
            }
          });
          if (piece.initial === "p") {
            let possibleAttacks: Array<Coordinates> = [];
            if (piece.generateAttacks) {
              possibleAttacks = piece.generateAttacks();
            }
            possibleAttacks.forEach((coord: Coordinates) => {
              invariant(boardState.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (boardState.current.whitePositions.includes(pieceMap)) {
                trueMoves.push(coord);
              }
              if (lastMove.current.color === 0 && lastMove.current.special) {
                if (lastMove.current.endPosition.y === coord.y + 1) {
                  if (lastMove.current.endPosition.x === coord.x) {
                    trueMoves.push(coord);
                  }
                }
              }
            });
          }
          return trueMoves;
        }
        return [];
      }
    }
  };

  const sendWhiteMove = async(
    callingPiece: Piece,
    newLocation: Coordinates,
  ) => {
    invariant(boardState.current, "Board State must be initialized");
    let coordMap = ( newLocation.y * 8 ) + newLocation.x;
    if(turns % 2 === 1){
      let pieceMap = callingPiece.position.y * 8 + callingPiece.position.x;
      let remove = boardState.current.whitePositions.indexOf(pieceMap);
      boardState.current.whitePositions.splice(remove,1);
      boardState.current.whitePositions.push(coordMap);
    }
    await refreshDom();
    if (callingPiece.initial === "p") {
      if (lastMove.current.special) {
          if (newLocation.y + 1 === lastMove.current.endPosition.y) {
            if (newLocation.x === lastMove.current.endPosition.x) {
              await returnCaptureBlack(
                lastMove.current.endPosition.y * 8 +
                  lastMove.current.endPosition.x,
            );
          }
        }
      }
    }

    lastMove.current = {
      endPosition: newLocation,
      special: callingPiece.special,
      initial: callingPiece.initial,
      color: callingPiece.color,
    };
    callingPiece.position = newLocation;
    callingPiece.special = false;

    if ( boardState.current.blackPositions.includes(coordMap) ) {
      console.log('captured black');
      await returnCaptureBlack(coordMap);
    }
    if (callingPiece.initial === "k") {
      boardState.current.whiteKing = coordMap;
    }
    callingPiece.update(newLocation);
    setTurns(turns + 1);
  }

  const sendBlackMove = async(
    callingPiece: Piece,
    newLocation: Coordinates,
  ) => {
    invariant(boardState.current, "Board State must be initialized");
    let coordMap = ( newLocation.y * 8 ) + newLocation.x;
    if(turns % 2 === 0){
      let pieceMap = callingPiece.position.y * 8 + callingPiece.position.x;
      let remove = boardState.current.blackPositions.indexOf(pieceMap);
      boardState.current.blackPositions.splice(remove,1);
      boardState.current.blackPositions.push(coordMap);
      await refreshDom();
      if (callingPiece.initial === "p") {
        if (lastMove.current.special) {
            if (newLocation.y - 1 === lastMove.current.endPosition.y) {
              if (newLocation.x === lastMove.current.endPosition.x) {
                await returnCaptureWhite(
                  lastMove.current.endPosition.y * 8 +
                    lastMove.current.endPosition.x,
              );
            }
          }
        }
      }

      lastMove.current = {
        endPosition: newLocation,
        special: callingPiece.special,
        initial: callingPiece.initial,
        color: 1,
      };

      callingPiece.position = newLocation;
      callingPiece.special = false;

      if ( boardState.current.whitePositions.includes(coordMap) ) {
        await returnCaptureWhite(coordMap);
      }
      if (callingPiece.initial === "k") {
        boardState.current.blackKing = coordMap;
      }
      callingPiece.update(newLocation);
      setTurns(turns + 1);
    }
  }

  const receiveWhiteAlert = async ( piece : Piece ) => {
    await refreshDom();
    if( turns % 2 === 1){
      let moves = generateWhitePieceMoves(piece) as Array<Coordinates>;
      let bubbles = moves.map( move => {
        return (
          <MoveSpot
            initialPosition={move}
            thisPiece={piece}
            sendMove={sendWhiteMove}
          />
        )
      });
      setMoveBubbles(bubbles);
    }
    return;
  }

  const receiveBlackAlert = async ( piece : Piece) => {
    await refreshDom();
    if( turns % 2 === 0){
      let moves = generateBlackPieceMoves(piece) as Array<Coordinates>;
      let bubbles = moves.map( move => {
        return (
          <MoveSpot
            initialPosition={move}
            thisPiece={piece}
            sendMove={sendBlackMove}
            />
        )
      });
      setMoveBubbles(bubbles);
    }
  }

  useEffect(() => {
    //generatePositionMap();
    //checkKing();
    console.log(boardState.current?.blackPositions);
    console.log(boardState.current?.whitePositions);
  }, [turns]);

  return (
    <div className="flex flex-col gap-2">
      {turns && <h1 className="text-white">{turns}</h1>}
      <div
        className="board bg-slate-800"
        onClick={async (e) => await refreshDom()}
      >
        { Array.apply(null, Array(2)).map((a, y) => {
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
              updateBoard={registerPiece}
              notifyBoard={receiveBlackAlert}
              key={`BlackPawn${x}`}
            />
          );
        case 0:
          switch (x) {
            case 0:
              return (
                <BlackRook
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackRook${x}`}
                />
              );
            case 1:
              return (
                <BlackHorse
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackHorse${x}`}
                />
              );
            case 2:
              return (
                <BlackBishop
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackBishop${x}`}
                />
              );
            case 3:
              return (
                <BlackQueen
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackQueen${x}`}
                />
              );
            case 4:
              return (
                <BlackKing
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackKing${x}`}
                />
              );
            case 5:
              return (
                <BlackBishop
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackBishop${x}`}
                />
              );
            case 6:
              return (
                <BlackHorse
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackHorse${x}`}
                />
              );
            case 7:
              return (
                <BlackRook
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackRook${x}`}
                />
              );
            default:
              return (
                <BlackPawn
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveBlackAlert}
                  key={`BlackPawn${x}`}
                />
              );
          }
        default:
          return (
            <BlackPawn
              initialPosition={thisPosition}
              updateBoard={registerPiece}
              notifyBoard={receiveBlackAlert}
              key={`BlackPawn${x}`}
            />
          );
      }
    });
  }) }
        {Array.apply(null, Array(2)).map((a, y) => {
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
              updateBoard={registerPiece}
              notifyBoard={receiveWhiteAlert}
              key={`WhitePawn${x}`}
            />
          );
        case 1:
          switch (x) {
            case 0:
              return (
                <WhiteRook
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteRook${x}`}
                />
              );
            case 1:
              return (
                <WhiteHorse
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteHorse${x}`}
                />
              );
            case 2:
              return (
                <WhiteBishop
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteBishop${x}`}
                />
              );
            case 3:
              return (
                <WhiteQueen
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteQueen${x}`}
                />
              );
            case 4:
              return (
                <WhiteKing
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteKing${x}`}
                />
              );
            case 5:
              return (
                <WhiteBishop
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteBishop${x}`}
                />
              );
            case 6:
              return (
                <WhiteHorse
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteHorse${x}`}
                />
              );
            case 7:
              return (
                <WhiteRook
                  initialPosition={thisPosition}
                  updateBoard={registerPiece}
                  notifyBoard={receiveWhiteAlert}
                  key={`WhiteRook${x}`}
                />
              );
          }
      }
    });
  })}
        {moveBubbles}
      </div>
    </div>
  );
};

export default OfflineChessBoard;
