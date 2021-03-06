import { useEffect, useRef, useState } from 'react';
import { Coordinates, Notifier, Piece } from '~/types';

const BlackQueen = ({
  initialPosition,
  updateBoard,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  updateBoard: Function;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece bq `);
  const position = useRef(initialPosition);
  const start = initialPosition;
  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece bq square${newLocation.y}${newLocation.x}`;
    position.current = newLocation;
    setMyClass(newClass);
  };
  const queenMoves = () => {
    let px = position.current.x;
    let py = position.current.y;
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
    px = position.current.x;
    py = position.current.y;
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
    px = position.current.x;
    py = position.current.y;
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
    px = position.current.x;
    py = position.current.y;
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
    px = position.current.x;
    py = position.current.y;
    while (px > 0) {
      px--;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.current.x;
    while (px < 7) {
      px++;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    px = position.current.x;
    while (py < 7) {
      py++;
      chunk.push({
        x: px,
        y: py,
      });
    }
    possibleMoves.push(chunk);
    chunk = [];
    py = position.current.y;
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
    index: initialPosition.x * initialPosition.y * 8,

    position: position.current,
    moves: [],
    color: 1,
    update: getUpdated,
    generateMoves: queenMoves,
    arrayLocation: start,
    initial: "q",
    alive: true,
  };
  const thisNotifier: Notifier = {
    arrayLocation: start,
    color: 1,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
    updateBoard({ type: "registerBlackPiece", piece: thisQueen });
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

export default BlackQueen;
