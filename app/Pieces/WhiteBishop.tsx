import { useState, useEffect} from 'react';
import { Coordinates, Piece } from "~/types";

const WhiteBishop = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wb `);
    const [position, setPosition] = useState(initialPosition);
    const start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wb square${newLocation.y}${newLocation.x}`;
        setPosition(newLocation);
        setMyClass(newClass);
    }
    const bishopMoves = () => {
        let px = position.x;
        let py = position.y;
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
        position: position,
        moves: [],
        color: 0,
        update: getUpdated,
        generateMoves: bishopMoves,
        arrayLocation: start,
        initial: "b",
        alive: true,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.y}${position.x}`);
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