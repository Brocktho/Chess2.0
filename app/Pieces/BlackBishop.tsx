import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackBishop = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bb `);
    const position = useRef(initialPosition);
    const start = initialPosition;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bb square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisBishop : Piece = {
        position: position.current,
        moves: [],
        color: 1,
        update: getUpdated,
        arrayLocation: start,
        initial: "b",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
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

export default BlackBishop