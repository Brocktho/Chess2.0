import { useEffect, useState } from "react";
import { NetPiece } from "../Pieces/InternetPiece";
import MoveSpot from "~/Pieces/InternetMoveSpot";
import type { Coordinates } from "~/types";
import invariant from "tiny-invariant";

const ChessBoard = ({ dispatch }: { dispatch: Function }) => {
  const killCoord: Coordinates = {
    x: -999,
    y: -999,
  };

  const sendMove = async () => {};

  useEffect(() => {}, [turn]);

  return (
    <div className="board bg-slate-800">
      {blackPieces}
      {whitePieces}
      {moveBubbles}
    </div>
  );
};

export default ChessBoard;
