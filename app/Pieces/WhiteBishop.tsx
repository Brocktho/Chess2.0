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
        setMyClass(newClass);
    }
    const thisBishop : Piece = {
        position: position.current,
        moves: [],
        color: 0,
        update: getUpdated,
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
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default WhiteBishop