import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhitePawn = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wp `);
    const position = useRef<Coordinates>(initialPosition);
    const start = {
        x:initialPosition.x,
        y:(initialPosition.y-6),
    };
    const movement = "y";
    const direction = "negative";
    const specialMove = true;
    const specialAttack = false;
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wp square${newLocation.y}${newLocation.x}`;
        setMyClass(newClass);
    }
    const thisPawn : Piece = {
        position: position.current,
        moves: [
            {
                x:position.current.x,
                y:position.current.y-1,
            },
            {
                x:position.current.x,
                y:position.current.y-2,
            }
        ],
        color: 0,
        update: getUpdated,
        arrayLocation: start,
        initial: "p",
        alive: true,
        special: specialMove,
    };
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 0,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisPawn);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default WhitePawn