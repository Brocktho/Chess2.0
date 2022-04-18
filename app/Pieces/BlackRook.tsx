import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackRook = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece br `);
    const position = useRef(initialPosition);
    let start = initialPosition;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece br square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisRook : Piece = {
        position: position.current,
        moves: [],
        color: 1,
        update: getUpdated,
        arrayLocation: start,
        initial: "r",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
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

export default BlackRook