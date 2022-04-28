import { useState, useEffect, useRef } from "react";
import type { Piece, Coordinates } from "~/types";

const MoveSpot = ({
  initialPosition,
  thisPiece,
  sendMove,
}: {
  initialPosition: Coordinates;
  thisPiece: Piece;
  sendMove: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece wp z-20 hidden`);
  const position = useRef(initialPosition);

  useEffect(() => {
    let piece: string;
    if (thisPiece.color === 0) {
      piece = `w${thisPiece.initial}`;
    } else {
      piece = `b${thisPiece.initial}`;
    }
    setMyClass(
      `piece ${piece} opacity-25 z-100 square${position.current.y}${position.current.x}`
    );
  }, []);

  return (
    <button
      className={myClass}
      onClick={(e) => {
        e.stopPropagation();
        sendMove(thisPiece, initialPosition);
      }}
    />
  );
};

export default MoveSpot;
