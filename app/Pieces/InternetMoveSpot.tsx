import { useState, useEffect, useRef } from "react";
import type { InternetPiece, Coordinates } from "~/types";

const MoveSpot = ({
  initialPosition,
  thisPiece,
  sendMove,
}: {
  initialPosition: Coordinates;
  thisPiece: InternetPiece;
  sendMove: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece`);
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    let piece: string;
    if (thisPiece.color === 0) {
      piece = `w${thisPiece.initial}`;
    } else {
      piece = `b${thisPiece.initial}`;
    }
    setMyClass(
      `piece ${piece} opacity-25 z-100 square${position.y}${position.x}`
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