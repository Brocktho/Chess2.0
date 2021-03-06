import { useEffect, useRef, useState } from 'react';
import { Coordinates, Notifier, Piece } from '~/types';

const BlackRook = ({
  initialPosition,
  updateBoard,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  updateBoard: Function;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece br `);
  const specialMove = useRef<boolean>(true);
  const position = useRef(initialPosition);
  let start = initialPosition;
  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece br square${newLocation.y}${newLocation.x}`;
    position.current = newLocation;
    specialMove.current = false;
    setMyClass(newClass);
  };
  const rookMoves = () => {
    let px = position.current.x;
    let py = position.current.y;
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
    px = position.current.x;
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
    chunk = [];
    return possibleMoves;
  };
  const thisRook: Piece = {
    index: initialPosition.x * initialPosition.y * 8,

    position: position.current,
    moves: [],
    color: 1,
    update: getUpdated,
    generateMoves: rookMoves,
    arrayLocation: start,
    initial: "r",
    alive: true,
    special: specialMove.current,
  };
  const thisNotifier: Notifier = {
    arrayLocation: start,
    color: 1,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
    updateBoard({ type: "registerBlackPiece", piece: thisRook });
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

export default BlackRook;
