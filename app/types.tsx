export type Coordinates = {
  x: number;
  y: number;
};

export type Piece = {
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

export type BoardState = {
  whitePieces?: Array<JSX.Element>;
  blackPieces?: Array<JSX.Element>;
}

export type State = {
  whitePieces?: Array<JSX.Element>;
  blackPieces?: Array<JSX.Element>;
  turn: number;
  moveBubbles?: Array<JSX.Element> | null;
  displayPlayer?: string;
  player?: number;
}

export type Action = 
|{ type: 'loading' }
|{ type: 'error' }
|{ type: 'foundPlayer', player:number, display:string}
|{ type: 'loadBoard', whitePieces: Array<JSX.Element>, blackPieces:Array<JSX.Element> }
|{ type: 'castMoves', bubbles: Array<JSX.Element>}
|{ type: "refresh", newLocations: Array<Array<Coordinates>>}

export type InternetPiece = {
  position: Coordinates;
  moves: Array<Array<Coordinates>>;
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
}

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
