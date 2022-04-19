import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const WhitePawn = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wp `);
    const position = useRef<Coordinates>(initialPosition);
    const specialMove = useRef<boolean>(true);

    const start = {
        x:initialPosition.x,
        y:(initialPosition.y-6),
    };

    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wp square${newLocation.y}${newLocation.x}`;
        specialMove.current = false;
        position.current = newLocation;
        setMyClass(newClass);
    }

    const whitePawnMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Coordinates> = [];
        if(specialMove.current){
            possibleMoves.push({
                x: px,
                y: py-2
            });
        }
        possibleMoves.push({
            x: px,
            y:py-1
        })
        return possibleMoves;
    }
    const whitePawnAttacks = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleAttacks : Array<Coordinates> = [];
        possibleAttacks.push({
            x: px-1,
            y: py-1
        })
        possibleAttacks.push({
            x: px+1,
            y: py-1,
        })
        return possibleAttacks;
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
        generateMoves: whitePawnMoves,
        generateAttacks: whitePawnAttacks,
        arrayLocation: start,
        initial: "p",
        alive: true,
        special: specialMove.current,
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