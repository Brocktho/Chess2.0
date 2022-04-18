import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhiteKing = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wk `);
    const position = useRef(initialPosition);
    const start = {
        x: initialPosition.x,
        y: (initialPosition.y-6),
    }
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wk square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisKing : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: setMyClass,
        arrayLocation: start,
        initial: "k",
        alive: true,
        special: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 0,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisKing);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default WhiteKing