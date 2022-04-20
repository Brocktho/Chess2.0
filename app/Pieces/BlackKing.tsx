import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackKing = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bk `);
    const position = useRef(initialPosition);
    const start = initialPosition;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bk square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        setMyClass(newClass);
    }
    const kingMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Coordinates> = [];
        if(py < 7){
            possibleMoves.push({
                x: px,
                y: py+1
            })
            if(px < 7){
                possibleMoves.push({
                    x: px+1,
                    y: py+1
                })
            }
            if(px > 0){
                possibleMoves.push({
                    x: px-1,
                    y: py+1
                })
            }
        }
        if(py > 0){
            possibleMoves.push({
                x: px,
                y: py-1
            })
            if(px < 7){
                possibleMoves.push({
                    x: px+1,
                    y: py-1
                })
            }
            if(px > 0){
            possibleMoves.push({
                x: px-1,
                y: py-1
            })
            }
        }
        if(px < 7){
            possibleMoves.push({
                x: px+1,
                y: py
            })
        }
        if(px > 0){
            possibleMoves.push({
                x: px-1,
                y: py
            })
        }
        return possibleMoves;
    }
    const thisKing : Piece = {
        position: position.current,
        moves: [],
        color: 1,
        update: getUpdated,
        generateMoves: kingMoves,
        arrayLocation: start,
        initial: "k",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
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

export default BlackKing