import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackKing = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bk `);
    const position = useRef(initialPosition);
    const start = initialPosition;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bk square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisKing : Piece = {
        position: position.current,
        moves: [],
        color: 1,
        update: getUpdated,
        arrayLocation: start,
        initial: "k",
        alive: true,
    }
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
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

export default BlackKing