import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackQueen = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bq `);
    const position = useRef(initialPosition);
    const start = initialPosition;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bq square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        setMyClass(newClass);
    }
    const queenMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Coordinates> = [];
        while(px < 7 && py < 7){
            px++;
            py++;
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        px = position.current.x;
        py = position.current.y;
        while(px < 7 && py > 0){
            px++
            py--
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        px = position.current.x;
        py = position.current.y;
        while(px > 0 && py < 7){
            px--
            py++
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        px = position.current.x;
        py = position.current.y;
        while(px > 0 && py > 0){
            px--
            py--
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        px = position.current.x;
        py = position.current.y;
        while(px > 0){
            px--
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        px = position.current.x;
        while(px < 7){
            px++
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        px = position.current.x;
        while(py < 7){
            py++
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        py = position.current.y;
        while(py > 0){
            py--
            possibleMoves.push({
                x:px,
                y:py
            })
        }
        return possibleMoves;
    }
    const thisQueen : Piece = {
        position: position.current,
        moves: [],
        color: 1,
        update: getUpdated,
        generateMoves: queenMoves,
        arrayLocation: start,
        initial: "q",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisQueen);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default BlackQueen