import type { Coordinates } from "~/types";

export type MoveGenerator = () => Array<Array<Coordinates>>

export type Piece =
  | {
      index: number;
      position: Coordinates;
      moves?: Array<Array<Coordinates>>;
      color: number;
      update: Function;
      generateMoves: MoveGenerator;
      generateAttacks: MoveGenerator;
      arrayLocation: Coordinates;
      initial: "p";
      alive: boolean;
      special: boolean;
    }
  | {
      index: number;
      position: Coordinates;
      moves?: Array<Array<Coordinates>>;
      color: number;
      update: Function;
      generateMoves: MoveGenerator;
      arrayLocation: Coordinates;
      initial: "q";
      alive: boolean;
    }
  | {
      index: number;
      position: Coordinates;
      moves?: Array<Array<Coordinates>>;
      color: number;
      update: Function;
      generateMoves: MoveGenerator;
      arrayLocation: Coordinates;
      initial: "r";
      alive: boolean;
      special: boolean;
    }
  | {
      index: number;
      position: Coordinates;
      moves?: Array<Array<Coordinates>>;
      color: number;
      update: Function;
      generateMoves: MoveGenerator;
      arrayLocation: Coordinates;
      initial: "h";
      alive: boolean;
    }
  | {
      index: number;
      position: Coordinates;
      moves?: Array<Array<Coordinates>>;
      color: number;
      update: Function;
      generateMoves: MoveGenerator;
      arrayLocation: Coordinates;
      initial: "k";
      alive: boolean;
      special: boolean;
    }
  | {
      index: number;
      position: Coordinates;
      moves?: Array<Array<Coordinates>>;
      color: number;
      update: Function;
      generateMoves: MoveGenerator;
      arrayLocation: Coordinates;
      initial: "b";
      alive: boolean;
    };

export type PieceRef =   | {
    update: Function;
    index: number;
    position: number;
    generateMoves: Function;
    generateAttacks: Function;
    initial: "p";
  }
| {
    update: Function;
    index: number;
    position: number;
    generateMoves: Function;
    initial: "q";
  } |
  {
    update: Function;
    index: number;
    position: number;
    generateMoves: Function;
    initial: "r";
  } |
  {
    update: Function;
    index: number;
    position: number;
    generateMoves: Function;
    initial: "h";
  } |
  {
    update: Function;
    index: number;
    position: number;
    generateMoves: Function;
    initial: "b";
  } |
  {
    update: Function;
    index: number;
    position: number;
    generateMoves: Function;
    initial: "k";
  } 