import { useState, useEffect } from "react";
import type { Coordinates, Piece } from "~/types";

const WhiteQueen = ({
  initialPosition,
  updateBoard,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  updateBoard: Function;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece wq `);
  const [position, setPosition] = useState(initialPosition);
  const start = {
    x: initialPosition.x,
    y: initialPosition.y - 6,
  };
  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece wq square${newLocation.y}${newLocation.x}`;
    setPosition(newLocation);
    setMyClass(newClass);
  };
  const queenMoves = () => {
    let px = position.x;
    let py = position.y;
    let possibleMoves: Array<Array<Coordinates>> = [];
    let chunk: Array<Coordinates> = [];
    while (px < 7 && py < 7) {
      px++;
      py++;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.x;
    py = position.y;
    while (px < 7 && py > 0) {
      px++;
      py--;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.x;
    py = position.y;
    while (px > 0 && py < 7) {
      px--;
      py++;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.x;
    py = position.y;
    while (px > 0 && py > 0) {
      px--;
      py--;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.x;
    py = position.y;
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
    return possibleMoves;
  };

  const thisQueen: Piece = {
    position: position,
    moves: [],
    color: 0,
    update: getUpdated,
    generateMoves: queenMoves,
    arrayLocation: start,
    initial: "q",
    alive: true,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.y}${position.x}`);
    updateBoard(thisQueen);
  }, []);

  return (
    <button
      className={myClass}
      onClick={(e) => {
        e.stopPropagation();
        notifyBoard(thisQueen);
      }}
    />
  );
};

export default WhiteQueen;
