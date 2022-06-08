import { useEffect, useState } from 'react';

import type { Coordinates, Piece } from "~/types";

const WhiteHorse = ({
  initialPosition,
  updateBoard,
  notifyBoard,
}: {
  initialPosition: Coordinates;
  updateBoard: Function;
  notifyBoard: Function;
}) => {
  const [myClass, setMyClass] = useState(`piece wh `);
  const [position, setPosition] = useState(initialPosition);
  let start = {
    x: initialPosition.x,
    y: initialPosition.y - 6,
  };
  const getUpdated = (newLocation: Coordinates) => {
    let newClass = `piece wh square${newLocation.y}${newLocation.x}`;
    setPosition(newLocation);
    setMyClass(newClass);
  };

  let HorseMoves = () => {
    let possibleMoves: Array<Array<Coordinates>> = [];
    let px = position.x;
    let py = position.y;
    let possibleX: Array<number> = [];
    let possibleY: Array<number> = [];
    switch (px) {
      case 0:
        possibleX.push(px + 2);
        possibleX.push(px + 1);
        break;
      case 1:
        possibleX.push(px - 1);
        possibleX.push(px + 1);
        possibleX.push(px + 2);
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        possibleX.push(px - 2);
        possibleX.push(px - 1);
        possibleX.push(px + 1);
        possibleX.push(px + 2);
        break;
      case 6:
        possibleX.push(px - 2);
        possibleX.push(px - 1);
        possibleX.push(px + 1);
        break;
      case 7:
        possibleX.push(px - 2);
        possibleX.push(px - 1);
        break;
    }
    switch (py) {
      case 0:
        possibleY.push(py + 2);
        possibleY.push(py + 1);
        break;
      case 1:
        possibleY.push(py + 2);
        possibleY.push(py + 1);
        possibleY.push(py - 1);
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        possibleY.push(py - 2);
        possibleY.push(py - 1);
        possibleY.push(py + 1);
        possibleY.push(py + 2);
        break;
      case 6:
        possibleY.push(py - 2);
        possibleY.push(py - 1);
        possibleY.push(py + 1);
        break;
      case 7:
        possibleY.push(py - 2);
        possibleY.push(py - 1);
    }
    let chunk: Array<Coordinates> = [];
    possibleY.map((y) => {
      possibleX.map((x) => {
        if (y === py + 2 || y === py - 2) {
          if (x === px + 1 || x === px - 1) {
            chunk = [];
            chunk.push({
              x: x,
              y: y,
            });
            possibleMoves.push(chunk);
          }
        }
        if (y === py + 1 || y === py - 1) {
          if (x === px + 2 || x === px - 2) {
            chunk = [];
            chunk.push({
              x: x,
              y: y,
            });
            possibleMoves.push(chunk);
          }
        }
      });
    });
    return possibleMoves;
  };

  let thisHorse: Piece = {
    index: initialPosition.x * initialPosition.y * 8,

    position: position,
    moves: [],
    color: 0,
    update: getUpdated,
    generateMoves: HorseMoves,
    arrayLocation: start,
    initial: "h",
    alive: true,
  };

  useEffect(() => {
    setMyClass(`${myClass} square${position.y}${position.x}`);
    updateBoard({ type: "registerWhitePiece", piece: thisHorse });
  }, []);

  return (
    <button
      className={myClass}
      onClick={(e) => {
        e.stopPropagation();
        notifyBoard(thisHorse);
      }}
    />
  );
};

export default WhiteHorse;
