import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackPawn = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bp `);
    const position = useRef<Coordinates>(initialPosition);
    const start = initialPosition;
    const movement = "y";
    const direction = "positive";
    const specialMove = true;
    const specialAttack = false;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bp square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisPawn : Piece = {
        position: position.current,
        moves: [
            {
                x:position.current.x,
                y:position.current.y+1,
            },
            {
                x:position.current.x,
                y:position.current.y+2,
            }
        ],
        color: 1,
        update: getUpdated,
        arrayLocation: start,
        initial: "p",
        alive: true,
        special: specialMove,
    };
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisPawn);
    },[])

    return(
        <button className = {myClass}  onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default BlackPawn