import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackRook = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece br `);
    const position = useRef(initialPosition);
    let start = initialPosition;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece br square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        setMyClass(newClass);
    }
    const rookMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Coordinates> = [];
        while(px < 7){
            px++;
            possibleMoves.push({
                x: px,
                y: py,
            })
        }
        px = position.current.x;
        while(px > 0){
            px--
            possibleMoves.push({
                x: px,
                y: py,
            })
        }
        px = position.current.x;
        while(py < 7){
            py++
            possibleMoves.push({
                x: px,
                y: py,
            })
        }
        py = position.current.y;
        while(py > 0){
            py--
            possibleMoves.push({
                x: px,
                y: py,
            })
        }
        return possibleMoves; 
    }
    const thisRook : Piece = {
        position: position.current,
        moves: [],
        color: 1,
        update: getUpdated,
        generateMoves: rookMoves,
        arrayLocation: start,
        initial: "r",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisRook);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default BlackRook