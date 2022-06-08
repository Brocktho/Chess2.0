import { useEffect, useRef, useState } from 'react';

import type { Coordinates, Piece } from "~/types";

const WhitePawn = ({
  initialPosition,
  updateBoard,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  updateBoard: Function;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece wp `);
  const [position, setPosition] = useState<Coordinates>(initialPosition);
  const specialMove = useRef<boolean>(true);

  const start = {
    x: initialPosition.x,
    y: initialPosition.y - 6,
  };

  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece wp square${newLocation.y}${newLocation.x}`;
    specialMove.current = false;
    setPosition(newLocation);
    setMyClass(newClass);
  };

  const whitePawnMoves = () => {
    let px = position.x;
    let py = position.y;
    let possibleMoves: Array<Array<Coordinates>> = [];
    let chunk: Array<Coordinates> = [];
    chunk.push({
      x: px,
      y: py - 1,
    });
    if (specialMove.current) {
      chunk.push({
        x: px,
        y: py - 2,
      });
    }
    possibleMoves.push(chunk);
    return possibleMoves;
  };
  const whitePawnAttacks = () => {
    let px = position.x;
    let py = position.y;
    let possibleAttacks: Array<Coordinates> = [];
    possibleAttacks.push({
      x: px - 1,
      y: py - 1,
    });
    possibleAttacks.push({
      x: px + 1,
      y: py - 1,
    });
    return possibleAttacks;
  };

  const thisPawn: Piece = {
    index: initialPosition.x + initialPosition.y * 8,
    position: position,
    moves: [],
    color: 0,
    update: getUpdated,
    generateMoves: whitePawnMoves,
    generateAttacks: whitePawnAttacks,
    arrayLocation: start,
    initial: "p",
    alive: true,
    special: specialMove.current,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.y}${position.x}`);
    updateBoard({ type: "registerWhitePiece", piece: thisPawn });
  }, []);

  return (
    <button
      className={myClass}
      onClick={(e) => {
        e.stopPropagation();
        notifyBoard(thisPawn);
      }}
    />
  );
};

export default WhitePawn;
