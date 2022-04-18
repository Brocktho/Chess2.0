import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackHorse = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bh `);
    const position = useRef(initialPosition);
    let start = initialPosition
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bh square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    let thisNotifier = {
        arrayLocation: start,
        color: 1
    }
    let thisHorse : Piece = {
        position: position.current,
        moves: [
            {
                x: position.current.x-1,
                y: position.current.y+2,
            },
            {
                x: position.current.x+1,
                y: position.current.y+2,
            }
        ],
        color: 1,
        update: getUpdated,
        arrayLocation: start,
        initial: "h",
        alive: true,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisHorse);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default BlackHorse