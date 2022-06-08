import { useState, useEffect } from "react";
import type { Coordinates, InternetPiece } from "~/types";

export const NetPiece = ({
  initialPosition,
  pieceClass,
  color,
  moves,
  moveGenerator,
  id,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  pieceClass: string;
  color: number;
  moves: Array<Coordinates>;
  moveGenerator: Function;
  id: string;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece ${pieceClass}`);
  const [position, setPosition] = useState(initialPosition);

  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece ${pieceClass} square${newLocation.y}${newLocation.x}`;
    setPosition(newLocation);
    setMyClass(newClass);
  };

  const thisPiece: InternetPiece = {
    index: initialPosition.x * initialPosition.y * 8,

    position: position,
    moves: moves,
    moveGenerator: moveGenerator,
    color: color,
    update: getUpdated,
    initial: "r",
    alive: true,
    id: id,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.y}${position.x}`);
    console.log(myClass);
  }, []);

  return (
    <button
      className={myClass}
      onClick={(e) => {
        e.stopPropagation();
        notifyBoard(thisPiece);
      }}
    />
  );
};
