import { resolvePtr } from 'dns/promises';
import { cp } from 'fs/promises';
import { useState, useEffect, useRef } from 'react';
import { Coordinates, Piece, Notifier } from "~/types";

const BlackPawn = ({initialPosition, updateBoard, notifyBoard}:{initialPosition:Coordinates, updateBoard:Function, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bp `);
    const position = useRef<Coordinates>(initialPosition);
    const specialMove = useRef<boolean>(true);
    const start = initialPosition;
    
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bp square${newLocation.y}${newLocation.x}`;
        position.current = newLocation;
        specialMove.current = false;
        setMyClass(newClass);
    }
    const blackPawnMoves = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleMoves : Array<Coordinates> = [];
        if(specialMove.current){
            possibleMoves.push({
                x: px,
                y: py+2
            });
        }
        possibleMoves.push({
            x: px,
            y: py+1
        });
        return possibleMoves;
    }
    const blackPawnAttacks = () => {
        let px = position.current.x;
        let py = position.current.y;
        let possibleAttacks : Array<Coordinates> = [];
        possibleAttacks.push({
            x: px+1,
            y: py+1,
        })
        possibleAttacks.push({
            x: px-1,
            y: py+1
        })
        return possibleAttacks;
    }
    const thisPawn : Piece = {
        position: position.current,
        moves: [
            {
                x:position.current.x,
                y:position.current.y+1,
            },
            {
                x:position.current.x,
                y:position.current.y+2,
            }
        ],
        color: 1,
        update: getUpdated,
        generateMoves: blackPawnMoves,
        generateAttacks: blackPawnAttacks,
        arrayLocation: start,
        initial: "p",
        alive: true,
        special: specialMove,
    };
    const thisNotifier : Notifier = {
        arrayLocation: start,
        color: 1,
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
        updateBoard(thisPawn);
    },[])

    return(
        <button className = {myClass}  onClick={ e => { 
            e.stopPropagation();
            notifyBoard(e, thisNotifier)
        }}/>
    )
}

export default BlackPawn