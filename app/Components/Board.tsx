import { useEffect, useRef, useState, useReducer } from "react";
import invariant from "tiny-invariant";
import BlackBishop from "~/Pieces/BlackBishop";
import BlackHorse from "~/Pieces/BlackHorse";
import BlackKing from "~/Pieces/BlackKing";
import BlackPawn from "~/Pieces/BlackPawn";
import BlackQueen from "~/Pieces/BlackQueen";
import BlackRook from "~/Pieces/BlackRook";
import MoveSpot from "~/Pieces/MoveSpot";
import WhiteBishop from "~/Pieces/WhiteBishop";
import WhiteHorse from "~/Pieces/WhiteHorse";
import WhiteKing from "~/Pieces/WhiteKing";
import WhitePawn from "~/Pieces/WhitePawn";
import WhiteQueen from "~/Pieces/WhiteQueen";
import WhiteRook from "~/Pieces/WhiteRook";
import BoardUpdates from "~/BoardUpdates";

import type { Coordinates, Board, Piece, Movement, MoveTree } from "~/types";

const ChessBoard = () => {
  const [
    {
      player,
      blackInCheck,
      whiteInCheck,
      criticalPaths,
      whiteRefs,
      blackRefs,
      gameOver,
      moveRefs,
      turn,
      displayPlayer,
    },
    dispatchBoard,
  ] = useReducer(BoardUpdates, {
    player: null,
    blackInCheck: false,
    whiteInCheck: false,
    criticalPaths: [],
    whiteRefs: [],
    blackRefs: [],
    gameOver: false,
    moveRefs: null,
    turn: 0,
    displayPlayer: null,
  });

  const BOARD_STATE = useRef<Board | null>(null);
  const KILL_COORD: Coordinates = {
    x: -999,
    y: -999,
  };

  const LAST_MOVE = useRef<Movement>({
    endPosition: KILL_COORD,
    special: false,
    initial: "none",
    color: 2,
  });

  const REFRESH_DOM = async () => {
    setMoveBubbles(null);
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

  const CHECK_WHITE_KING = () => {
    const THREATS = BOARD_STATE.current?.threatOnWk as Array<MoveTree>;
    for (const INDEX in THREATS) {
      let blockers = 0;
      const MOVES = THREATS[INDEX].moves;
      for (const MOVE_INDEX in MOVES) {
        const MOVE = MOVES[MOVE_INDEX];
        const MOVE_MAP = MOVE.y * 8 + MOVE.x;
        if (BOARD_STATE.current?.whitePositions.includes(MOVE_MAP)) {
          blockers++;
        }
      }
    }
    if (blockers === 1) {
      setWhiteInCheck(true);
    }
  };

  const RETURN_CAPTURE_BLACK = async (coordMap: number) => {
    BOARD_STATE.current?.blackPieces.every((pieces, y) => {
      pieces.every((piece, x) => {
        let attackMap = piece.position.y * 8 + piece.position.x;
        if (!(attackMap === coordMap)) {
          return true;
        } else {
          piece.alive = false;
          piece.update(KILL_COORD);
          piece.position = KILL_COORD;
          const REMOVE = BOARD_STATE.current?.blackPositions.indexOf(
            attackMap
          ) as number;
          BOARD_STATE.current?.blackPositions.splice(REMOVE, 1);
          return false;
        }
      });
      return true;
    });
  };

  const RETURN_CAPTURE_WHITE = async (coordMap: number) => {
    BOARD_STATE.current?.whitePieces.every((pieces, y) => {
      pieces.every((piece, x) => {
        let attackMap = piece.position.y * 8 + piece.position.x;
        if (!(attackMap === coordMap)) {
          return true;
        } else {
          piece.alive = false;
          piece.update(KILL_COORD);
          piece.position = KILL_COORD;
          const REMOVE = BOARD_STATE.current?.whitePositions.indexOf(
            attackMap
          ) as number;
          BOARD_STATE.current?.whitePositions.splice(REMOVE, 1);
          return false;
        }
      });
      return true;
    });
  };

  const REGISTER_PIECE = (piece: Piece) => {
    let color = piece.color;
    if (!BOARD_STATE.current) {
      let newBoard: Board = {
        whiteKing: 60,
        blackKing: 4,
        threatOnWk: [],
        threatOnBk: [],
        whiteAttacks: [],
        blackAttacks: [],
        whitePositions: [],
        blackPositions: [],
        whitePieces: [],
        blackPieces: [],
      };
      BOARD_STATE.current = newBoard;
    }
    if (color === 0) {
      if (piece.arrayLocation.x === 0) {
        BOARD_STATE.current.whitePieces.push([]);
        BOARD_STATE.current.whitePieces[piece.arrayLocation.y].push(piece);
      } else {
        BOARD_STATE.current.whitePieces[piece.arrayLocation.y].push(piece);
      }
      BOARD_STATE.current.whitePositions.push(
        piece.position.y * 8 + piece.position.x
      );
    }
    if (color === 1) {
      if (piece.arrayLocation.x === 0) {
        BOARD_STATE.current.blackPieces.push([]);
        BOARD_STATE.current.blackPieces[piece.arrayLocation.y].push(piece);
      } else {
        BOARD_STATE.current.blackPieces[piece.arrayLocation.y].push(piece);
      }
      BOARD_STATE.current.blackPositions.push(
        piece.position.y * 8 + piece.position.x
      );
    }
  };

  const GENERATE_WHITE_MOVES = () => {
    BOARD_STATE.current?.whitePieces.forEach((pieces) => {
      pieces.forEach((piece) => {
        let moves: Array<Array<Coordinates>> = piece.generateMoves();
        piece.moves = moves;
      });
    });
  };

  const GENERATE_BLACK_MOVES = () => {
    BOARD_STATE.current?.blackPieces.forEach((pieces) => {
      pieces.forEach((piece) => {
        let moves: Array<Array<Coordinates>> = piece.generateMoves();
        piece.moves = moves;
      });
    });
  };

  const GENERATE_WHITE_PIECE_MOVES = (piece: Piece) => {
    if (piece.color === 0 && turns % 2 === 1) {
      if (piece.initial === "k") {
        let possibleMoves = piece.moves as Array<Array<Coordinates>>;
        let trueMoves: Array<Coordinates> = [];
        possibleMoves.forEach((chunk: Array<Coordinates>) => {
          chunk.every((coord: Coordinates) => {
            invariant(BOARD_STATE.current, "board exists");
            let pieceMap = coord.y * 8 + coord.x;
            if (!BOARD_STATE.current.whitePositions.includes(pieceMap)) {
              if (BOARD_STATE.current.blackAttacks.includes(pieceMap)) {
                return false;
              }
              if (BOARD_STATE.current.blackPositions.includes(pieceMap)) {
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
              invariant(BOARD_STATE.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (Array.isArray(BOARD_STATE.current.threatOnWk[0])) {
                let criticalPiece = false;
                let blockerList: Array<number> = [];
                BOARD_STATE.current.threatOnWk.forEach((attackVectors) => {
                  attackVectors.moves.forEach((attackMove) => {
                    let blockers = 0;
                    let attackMap = attackMove.y * 8 + attackMove.x;
                    if (
                      BOARD_STATE.current?.whitePositions.includes(attackMap)
                    ) {
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

              if (!BOARD_STATE.current.whitePositions.includes(pieceMap)) {
                if (piece.initial === "p") {
                  if (!BOARD_STATE.current.blackPositions.includes(pieceMap)) {
                    trueMoves.push(coord);
                    return true;
                  } else {
                    return false;
                  }
                }
                if (BOARD_STATE.current.blackPositions.includes(pieceMap)) {
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
          possibleMoves.forEach((moves) => {
            let isRelevant = false;
            let finalIndex = 0;
            moves.every((move) => {
              let attackMap = move.y * 8 + move.x;
              if (BOARD_STATE.current?.blackKing === attackMap) {
                isRelevant = true;
                return false;
              }
              finalIndex++;
              return true;
            });
            if (isRelevant) {
              BOARD_STATE.current?.threatOnBk.push({
                arrayLocation: piece.arrayLocation,
                moves: moves.slice(0, finalIndex),
              });
            }
          });
          trueMovesBuffer.forEach((coord: Coordinates) => {
            let pieceMap = coord.y * 8 + coord.x;
            if (!BOARD_STATE.current?.whitePositions.includes(pieceMap)) {
              if (piece.initial === "p") {
                if (!BOARD_STATE.current?.blackPositions.includes(pieceMap)) {
                  trueMoves.push(coord);
                  return true;
                } else {
                  return false;
                }
              }
              if (BOARD_STATE.current?.blackPositions.includes(pieceMap)) {
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
              invariant(BOARD_STATE.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (BOARD_STATE.current.blackPositions.includes(pieceMap)) {
                trueMoves.push(coord);
              }
              if (LAST_MOVE.current.color === 1 && LAST_MOVE.current.special) {
                if (LAST_MOVE.current.endPosition.y === coord.y + 1) {
                  if (LAST_MOVE.current.endPosition.x === coord.x) {
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

  const GENERATE_BLACK_PIECE_MOVES = (piece: Piece) => {
    if (piece.color === 1) {
      if (piece.initial === "k") {
        let possibleMoves: Array<Array<Coordinates>> = piece.generateMoves();
        let trueMoves: Array<Coordinates> = [];
        possibleMoves.forEach((chunk: Array<Coordinates>) => {
          chunk.every((coord: Coordinates) => {
            invariant(BOARD_STATE.current, "board exists");
            let pieceMap = coord.y * 8 + coord.x;
            if (!BOARD_STATE.current.blackPositions.includes(pieceMap)) {
              if (BOARD_STATE.current.whiteAttacks.includes(pieceMap)) {
                return false;
              }
              if (BOARD_STATE.current.whitePositions.includes(pieceMap)) {
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
          let criticalPiece = false;
          let criticalHits = 0;
          possibleMoves.forEach((chunk: Array<Coordinates>) => {
            chunk.every((coord: Coordinates) => {
              if (criticalPiece && criticalHits <= 1) {
                return false;
              }
              invariant(BOARD_STATE.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (Array.isArray(BOARD_STATE.current.threatOnBk[0])) {
                BOARD_STATE.current.threatOnBk.forEach((attackVectors) => {
                  attackVectors.moves.forEach((attackMove) => {
                    const REMOVE = BOARD_STATE.current?.blackPositions.indexOf(
                      piecePosition
                    ) as number;
                    BOARD_STATE.current?.blackPositions.splice(REMOVE, 1);
                    let attackMap = attackMove.y * 8 + attackMove.x;
                    if (attackMap === pieceMap) {
                      trueMovesBuffer.push(coord);
                    }
                    if (attackMap === piecePosition) {
                      criticalHits += 1;
                      criticalPiece = true;
                    }
                  });
                });
                if (criticalHits > 1) {
                  criticalPiece = false;
                }
                BOARD_STATE.current.blackPositions.push(piecePosition);
                if (criticalPiece) {
                  return false;
                }
              }
              if (!BOARD_STATE.current.blackPositions.includes(pieceMap)) {
                if (piece.initial === "p") {
                  if (!BOARD_STATE.current.whitePositions.includes(pieceMap)) {
                    trueMoves.push(coord);
                    return true;
                  } else {
                    return false;
                  }
                }
                if (BOARD_STATE.current.whitePositions.includes(pieceMap)) {
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
            if (!BOARD_STATE.current?.blackPositions.includes(pieceMap)) {
              if (piece.initial === "p") {
                if (!BOARD_STATE.current?.whitePositions.includes(pieceMap)) {
                  trueMoves.push(coord);
                  BOARD_STATE.current?.blackAttacks.push(pieceMap);
                  return true;
                } else {
                  return false;
                }
              }
              if (BOARD_STATE.current?.whitePositions.includes(pieceMap)) {
                trueMoves.push(coord);
                BOARD_STATE.current?.blackAttacks.push(pieceMap);
                return false;
              }
              trueMoves.push(coord);
              BOARD_STATE.current?.blackAttacks.push(pieceMap);
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
              invariant(BOARD_STATE.current, "board exists");
              let pieceMap = coord.y * 8 + coord.x;
              if (BOARD_STATE.current.whitePositions.includes(pieceMap)) {
                trueMoves.push(coord);
              }
              if (LAST_MOVE.current.color === 0 && LAST_MOVE.current.special) {
                if (LAST_MOVE.current.endPosition.y === coord.y - 1) {
                  if (LAST_MOVE.current.endPosition.x === coord.x) {
                    trueMoves.push(coord);
                  }
                }
              }
              BOARD_STATE.current.blackAttacks.push(pieceMap);
            });
          } else {
            possibleMoves.forEach((moves) => {
              let isRelevant = false;
              let finalIndex = 0;
              moves.every((move) => {
                let attackMap = move.y * 8 + move.x;
                if (BOARD_STATE.current?.whiteKing === attackMap) {
                  isRelevant = true;
                  return false;
                }
                finalIndex++;
                return true;
              });
              if (isRelevant) {
                BOARD_STATE.current?.threatOnWk.push({
                  arrayLocation: piece.arrayLocation,
                  moves: moves.slice(0, finalIndex),
                });
              }
            });
          }
          return trueMoves;
        }
        return [];
      }
    }
  };

  const SEND_WHITE_MOVE = async (
    callingPiece: Piece,
    newLocation: Coordinates
  ) => {
    invariant(BOARD_STATE.current, "Board State must be initialized");
    let coordMap = newLocation.y * 8 + newLocation.x;
    if (turns % 2 === 1) {
      let pieceMap = callingPiece.position.y * 8 + callingPiece.position.x;
      const REMOVE = BOARD_STATE.current.whitePositions.indexOf(pieceMap);
      BOARD_STATE.current.whitePositions.splice(REMOVE, 1);
      BOARD_STATE.current.whitePositions.push(coordMap);
      await REFRESH_DOM();
      if (callingPiece.initial === "p") {
        if (LAST_MOVE.current.special) {
          if (newLocation.y + 1 === LAST_MOVE.current.endPosition.y) {
            if (newLocation.x === LAST_MOVE.current.endPosition.x) {
              await RETURN_CAPTURE_BLACK(
                LAST_MOVE.current.endPosition.y * 8 +
                  LAST_MOVE.current.endPosition.x
              );
            }
          }
        }
      }
      LAST_MOVE.current = {
        endPosition: newLocation,
        special: callingPiece.special,
        initial: callingPiece.initial,
        color: callingPiece.color,
      };
      let boardPos = callingPiece.arrayLocation;
      BOARD_STATE.current.whitePieces[boardPos.y][boardPos.x].position =
        newLocation;
      callingPiece.special = false;

      if (BOARD_STATE.current.blackPositions.includes(coordMap)) {
        await RETURN_CAPTURE_BLACK(coordMap);
      }
      if (callingPiece.initial === "k") {
        BOARD_STATE.current.whiteKing = coordMap;
      }
      callingPiece.update(newLocation);
      setTurns(turns + 1);
    }
  };

  const SEND_BLACK_MOVE = async (
    callingPiece: Piece,
    newLocation: Coordinates
  ) => {
    invariant(BOARD_STATE.current, "Board State must be initialized");
    let coordMap = newLocation.y * 8 + newLocation.x;
    if (turns % 2 === 0) {
      let pieceMap = callingPiece.position.y * 8 + callingPiece.position.x;
      const REMOVE = BOARD_STATE.current.blackPositions.indexOf(pieceMap);
      BOARD_STATE.current.blackPositions.splice(REMOVE, 1);
      BOARD_STATE.current.blackPositions.push(coordMap);
      await REFRESH_DOM();
      if (callingPiece.initial === "p") {
        if (LAST_MOVE.current.special) {
          if (newLocation.y - 1 === LAST_MOVE.current.endPosition.y) {
            if (newLocation.x === LAST_MOVE.current.endPosition.x) {
              await RETURN_CAPTURE_WHITE(
                LAST_MOVE.current.endPosition.y * 8 +
                  LAST_MOVE.current.endPosition.x
              );
            }
          }
        }
      }

      LAST_MOVE.current = {
        endPosition: newLocation,
        special: callingPiece.special,
        initial: callingPiece.initial,
        color: 1,
      };
      let boardPos = callingPiece.arrayLocation;
      BOARD_STATE.current.blackPieces[boardPos.y][boardPos.x].position =
        newLocation;
      callingPiece.special = false;

      if (BOARD_STATE.current.whitePositions.includes(coordMap)) {
        await RETURN_CAPTURE_WHITE(coordMap);
      }
      if (callingPiece.initial === "k") {
        BOARD_STATE.current.blackKing = coordMap;
      }
      callingPiece.update(newLocation);
      setTurns(turns + 1);
    }
  };

  const RECEIVE_WHITE_ALERT = async (piece: Piece) => {
    await REFRESH_DOM();
    if (turns % 2 === 1) {
      let moves = GENERATE_WHITE_PIECE_MOVES(piece) as Array<Coordinates>;
      let bubbles = moves.map((move) => {
        return (
          <MoveSpot
            key={move.x + move.y * 8}
            initialPosition={move}
            thisPiece={piece}
            sendMove={SEND_WHITE_MOVE}
          />
        );
      });
      setMoveBubbles(bubbles);
    }
    return;
  };

  const RECEIVE_BLACK_ALERT = async (piece: Piece) => {
    await REFRESH_DOM();
    if (turns % 2 === 0) {
      let moves = GENERATE_BLACK_PIECE_MOVES(piece) as Array<Coordinates>;
      let bubbles = moves.map((move) => {
        return (
          <MoveSpot
            key={move.x + move.y * 8}
            initialPosition={move}
            thisPiece={piece}
            sendMove={SEND_BLACK_MOVE}
          />
        );
      });
      setMoveBubbles(bubbles);
    }
  };

  const WHITE_PIECES = Array.apply(null, Array(2)).map((a, y) => {
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
              updateBoard={REGISTER_PIECE}
              notifyBoard={RECEIVE_WHITE_ALERT}
              key={`WhitePawn${x}`}
            />
          );
        case 1:
          switch (x) {
            case 0:
              return (
                <WhiteRook
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteRook${x}`}
                />
              );
            case 1:
              return (
                <WhiteHorse
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteHorse${x}`}
                />
              );
            case 2:
              return (
                <WhiteBishop
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteBishop${x}`}
                />
              );
            case 3:
              return (
                <WhiteQueen
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteQueen${x}`}
                />
              );
            case 4:
              return (
                <WhiteKing
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteKing${x}`}
                />
              );
            case 5:
              return (
                <WhiteBishop
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteBishop${x}`}
                />
              );
            case 6:
              return (
                <WhiteHorse
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteHorse${x}`}
                />
              );
            case 7:
              return (
                <WhiteRook
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_WHITE_ALERT}
                  key={`WhiteRook${x}`}
                />
              );
          }
      }
    });
  });

  const BLACK_PIECES = Array.apply(null, Array(2)).map((a, y) => {
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
              updateBoard={REGISTER_PIECE}
              notifyBoard={RECEIVE_BLACK_ALERT}
              key={`BlackPawn${x}`}
            />
          );
        case 0:
          switch (x) {
            case 0:
              return (
                <BlackRook
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackRook${x}`}
                />
              );
            case 1:
              return (
                <BlackHorse
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackHorse${x}`}
                />
              );
            case 2:
              return (
                <BlackBishop
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackBishop${x}`}
                />
              );
            case 3:
              return (
                <BlackQueen
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackQueen${x}`}
                />
              );
            case 4:
              return (
                <BlackKing
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackKing${x}`}
                />
              );
            case 5:
              return (
                <BlackBishop
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackBishop${x}`}
                />
              );
            case 6:
              return (
                <BlackHorse
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackHorse${x}`}
                />
              );
            case 7:
              return (
                <BlackRook
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackRook${x}`}
                />
              );
            default:
              return (
                <BlackPawn
                  initialPosition={thisPosition}
                  updateBoard={REGISTER_PIECE}
                  notifyBoard={RECEIVE_BLACK_ALERT}
                  key={`BlackPawn${x}`}
                />
              );
          }
        default:
          return (
            <BlackPawn
              initialPosition={thisPosition}
              updateBoard={REGISTER_PIECE}
              notifyBoard={RECEIVE_BLACK_ALERT}
              key={`BlackPawn${x}`}
            />
          );
      }
    });
  });

  useEffect(() => {
    GENERATE_WHITE_MOVES();
    GENERATE_BLACK_MOVES();
  }, []);

  useEffect(() => {
    //CHECK_KING();
  }, [turn]);

  return (
    <div className="flex flex-col gap-2">
      {turn && <h1 className="text-white">{turn}</h1>}
      <div
        className="board bg-slate-800"
        onClick={async (e) => await REFRESH_DOM()}
      >
        {BLACK_PIECES}
        {WHITE_PIECES}
        {moveRefs}
      </div>
    </div>
  );
};

export default ChessBoard;
