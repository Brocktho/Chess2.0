import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteQueen = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wq `);
    const position = useRef(initialPosition);
    const start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wq square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisQueen : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: getUpdated,
        arrayLocation: start,
        initial: "q",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 0,
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

export default WhiteQueen