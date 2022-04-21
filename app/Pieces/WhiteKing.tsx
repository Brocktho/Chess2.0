import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteKing = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wk `);
    const position = useRef(initialPosition);
    const specialMove = useRef<boolean>(true);
    const start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wk square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        specialMove.current = false;
        setMyClass(newClass);
    }
    const kingMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Array<Coordinates>> = [];
        let chunk : Array<Coordinates> = [];
        if(py < 7){
            chunk.push({
                x: px,
                y: py+1
            })
            possibleMoves.push(chunk);
            chunk = [];
            if(px < 7){
                chunk.push({
                    x: px+1,
                    y: py+1
                })
            }
            possibleMoves.push(chunk);
            chunk = [];
            if(px > 0){
                chunk.push({
                    x: px-1,
                    y: py+1
                })
            }
            possibleMoves.push(chunk);
            chunk = [];
        }
        if(py > 0){
            chunk.push({
                x: px,
                y: py-1
            })
            possibleMoves.push(chunk);
            chunk = [];
            if(px < 7){
                chunk.push({
                    x: px+1,
                    y: py-1
                })
            }
            possibleMoves.push(chunk);
            chunk = [];
            if(px > 0){
            chunk.push({
                x: px-1,
                y: py-1
            })
            }
            possibleMoves.push(chunk);
            chunk = [];
        }
        possibleMoves.push(chunk);
        chunk = [];
        if(px < 7){
            chunk.push({
                x: px+1,
                y: py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        if(px > 0){
            chunk.push({
                x: px-1,
                y: py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        if(specialMove.current){
            chunk.push({
                x: px+1,
                y: py
            });
            chunk.push({
                x: px+2,
                y: py
            });
            possibleMoves.push(chunk);
            chunk = [];
            chunk.push({
                x: px-1,
                y: py
            });
            chunk.push({
                x: px-2,
                y: py
            });
            chunk.push({
                x: px-3,
                y: py
            });
            possibleMoves.push(chunk);
        }
        return possibleMoves;
    }
    const thisKing : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: getUpdated,
        generateMoves: kingMoves,
        arrayLocation: start,
        initial: "k",
        alive: true,
        special: specialMove.current,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 0,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisKing);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default WhiteKing