import type { Piece, PieceRef } from "./Pieces/types";

export type Coordinates = {
  x: number;
  y: number;
};

export type SocketState = {
  board?: InternetBoard;
  chat?: Function;
  history?: Function;
  displayPlayer?: string;
  player?: number;
};

export type MoveCast = {
  index: number;
  cast: Array<Array<Coordinates>>;
};

export type SocketAction =
  | { type: "loading" }
  | { type: "error" }
  | { type: "foundPlayer"; player: number; display: string }
  | { type: "loadBoard"; boardDirective: Array<String> };

export type BoardState = {
  player?: number;
  blackInCheck?: boolean;
  whiteInCheck?: boolean;
  criticalPaths?: Array<Array<Coordinates>>;
  whiteRefs: Array<PieceRef>;
  blackRefs: Array<PieceRef>;
  gameOver?: boolean;
  moveRefs: Array<JSX.Element> | null;
  turn: number;
  displayPlayer?: string;
  whitePieces?: Array<JSX.Element>;
  blackPieces?: Array<JSX.Element>;
  whiteKing: number;
  blackKing: number;
  whiteCasts: Array<MoveCast>;
  blackCasts: Array<MoveCast>;
};

export type BoardAction =
  | { type: "registerWhitePiece"; piece: Piece }
  | { type: "registerBlackPiece"; piece: Piece }
  | { type: "movePiece" }
  | { type: "refresh" }
  | { type: "castMoves"; bubbles: Array<JSX.Element> };

export type InternetPiece = {
  index: number;
  position: Coordinates;
  moves: Array<Coordinates>;
  moveGenerator: Function;
  color: number;
  update: Function;
  initial: string;
  alive: boolean;
  id: string;
};

export type MoveTree = {
  arrayLocation: Coordinates;
  moves: Array<Coordinates>;
};

export type Notifier = {
  arrayLocation: Coordinates;
  color: number;
};

export type InternetBoard = {
  whiteKing: number;
  blackKing: number;
  threatOnWk: Array<MoveTree>;
  threatOnBk: Array<MoveTree>;
  whiteAttacks: Array<number>;
  blackAttacks: Array<number>;
  whitePositions: Array<number>;
  blackPositions: Array<number>;
  whitePieces: Array<Array<InternetPiece>>;
  blackPieces: Array<Array<InternetPiece>>;
  whiteHistory: Array<String>;
  blackHistory: Array<String>;
  whiteCasts: Array<MoveTree>;
  blackCasts: Array<MoveTree>;
  moveBubbles: Array<JSX.Element>;
};

export type Board = {
  whiteKing: number;
  blackKing: number;
  threatOnWk: Array<MoveTree>;
  threatOnBk: Array<MoveTree>;
  whiteAttacks: Array<number>;
  blackAttacks: Array<number>;
  whitePositions: Array<number>;
  blackPositions: Array<number>;
  whitePieces: Array<Array<Piece>>;
  blackPieces: Array<Array<Piece>>;
};

export type LocationQuery = {
  coord: Coordinates;
  occupied: boolean;
};

export type Movement = {
  endPosition: Coordinates;
  special?: boolean;
  initial: string;
  color: number;
};

export type chatMessage = {
  name: string;
  message: string;
};
