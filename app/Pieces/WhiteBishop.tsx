import { useActionData } from '@remix-run/react';
import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteBishop = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wb `);
    const position = useRef(initialPosition);
    const start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wb square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        setMyClass(newClass);
    }
    const bishopMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let currentX = px;
        let currentY = py;
        let possibleMoves : Array<Array<Coordinates>> = [];
        let chunk : Array<Coordinates> = [];
        while(currentX < 7 && currentY < 7){
            currentX++
            currentY++ 
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        currentX = px;
        currentY = py;
        while(currentX < 7 && currentY > 0){
            currentX++
            currentY--
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        currentX = px;
        currentY = py;
        while(currentX > 0 && currentY < 7){
            currentX--
            currentY++
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        currentX = px;
        currentY = py;
        while(currentX > 0 && currentY > 0){
            currentX--
            currentY--
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        return possibleMoves;
    }
    const thisBishop : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: getUpdated,
        generateMoves: bishopMoves,
        arrayLocation: start,
        initial: "b",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 0,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisBishop);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(thisBishop);
        }}/>
    )
}

export default WhiteBishop