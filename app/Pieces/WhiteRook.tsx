import { useEffect, useRef, useState } from 'react';

import type { Coordinates, Piece } from "~/types";

const WhiteRook = ({
  initialPosition,
  updateBoard,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  updateBoard: Function;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece wr `);
  const specialMove = useRef<boolean>(true);
  const [position, setPosition] = useState(initialPosition);
  let start = {
    x: initialPosition.x,
    y: initialPosition.y - 6,
  };
  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece wr square${newLocation.y}${newLocation.x}`;
    setPosition(newLocation);
    setMyClass(newClass);
  };
  const rookMoves = () => {
    let px = position.x;
    let py = position.y;
    let possibleMoves: Array<Array<Coordinates>> = [];
    let chunk = [];
    while (px < 7) {
      px++;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.x;
    while (px > 0) {
      px--;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.x;
    while (py < 7) {
      py++;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    py = position.y;
    while (py > 0) {
      py--;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    return possibleMoves;
  };
  const thisRook: Piece = {
    index: initialPosition.x * initialPosition.y * 8,

    position: position,
    moves: [],
    color: 0,
    update: getUpdated,
    generateMoves: rookMoves,
    arrayLocation: start,
    initial: "r",
    alive: true,
    special: specialMove.current,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.y}${position.x}`);
    updateBoard({ type: "registerWhitePiece", piece: thisRook });
  }, []);

  return (
    <button
      className={myClass}
      onClick={(e) => {
        e.stopPropagation();
        notifyBoard(thisRook);
      }}
    />
  );
};

export default WhiteRook;
