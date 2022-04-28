export type Coordinates = {
  x: number;
  y: number;
};

export type Piece = {
  position: Coordinates;
  moves?: Array<Coordinates>;
  color: number;
  update: Function;
  generateMoves: Function;
  generateAttacks?: Function;
  arrayLocation: Coordinates;
  initial: string;
  alive: boolean;
  special?: boolean;
};

export type Notifier = {
  arrayLocation: Coordinates;
  color: number;
};

export type Board = {
  whiteKing: number;
  blackKing: number;
  attackOnWk: Array<Array<Coordinates>>;
  attackOnBk: Array<Array<Coordinates>>;
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
