import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteRook = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wr `);
    const position = useRef(initialPosition);
    let start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wr square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisRook : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: getUpdated,
        arrayLocation: start,
        initial: "r",
        alive: true,
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
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default WhiteRook