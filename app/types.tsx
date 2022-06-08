export type Coordinates = {
  x: number;
  y: number;
};

export type Piece = {
  index: number;
  position: Coordinates;
  moves?: Array<Array<Coordinates>>;
  color: number;
  update: Function;
  generateMoves: Function;
  generateAttacks?: Function;
  arrayLocation: Coordinates;
  initial: string;
  alive: boolean;
  special?: boolean;
};

export type PieceReference = {
  update: Function;
  index: number;
  position: number;
};

export type SocketState = {
  board?: InternetBoard;
  chat?: Function;
  history?: Function;
  displayPlayer?: string;
  player?: number;
};

export type SocketAction =
  | { type: "loading" }
  | { type: "error" }
  | { type: "foundPlayer"; player: number; display: string }
  | { type: "loadBoard"; boardDirective: Array<String> }
  | { type: "castMoves"; bubbles: Array<JSX.Element> }
  | { type: "refresh" };

export type BoardState = {
  player: number;
  blackInCheck: boolean;
  whiteInCheck: boolean;
  criticalPaths: Array<Array<Coordinates>>;
  whiteRefs: Array<PieceReference>;
  blackRefs: Array<PieceReference>;
  gameOver: boolean;
  moveRefs?: Array<JSX.Element>;
  turn: number;
  displayPlayer: string;
};

export type BoardAction = { type: "generateBoard" } | { type: "movePiece" };

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
