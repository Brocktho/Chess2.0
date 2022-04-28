import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteRook = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wr `);
    const specialMove = useRef<boolean>(true);
    const position = useRef(initialPosition);
    let start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wr square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        setMyClass(newClass);
    }
    const rookMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Array<Coordinates>> = [];
        let chunk = [];
        while(px < 7){
            px++;
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = position.current.x;
        while(px > 0){
            px--
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = position.current.x;
        while(py < 7){
            py++
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        py = position.current.y;
        while(py > 0){
            py--
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        return possibleMoves; 
    }
    const thisRook : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: getUpdated,
        generateMoves: rookMoves,
        arrayLocation: start,
        initial: "r",
        alive: true,
        special: specialMove.current,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 0,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisRook);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(thisRook);
        }}/>
    )
}

export default WhiteRook