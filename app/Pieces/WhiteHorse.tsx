import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteHorse = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wh `);
    const position = useRef(initialPosition);
    let start = {
        x:initialPosition.x,
        y:(initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wh square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    let thisNotifier = {
        arrayLocation: start,
        color: 0
    }
    let thisHorse : Piece = {
        position: position.current,
        moves: [
            {
                x: position.current.x-1,
                y: position.current.y-2,
            },
            {
                x: position.current.x+1,
                y: position.current.y-2,
            }
        ],
        color: 0,
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

export default WhiteHorse