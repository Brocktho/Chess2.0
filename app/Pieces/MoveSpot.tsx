import { useState, useEffect, useRef } from 'react';
import type { Coordinates } from "~/types";

const MoveSpot = ({initialPosition, color, initial, arrayLocation, sendMove}:{initialPosition:Coordinates, color:number, initial:string, arrayLocation:Coordinates, sendMove:Function}) => {
    const [myClass, setMyClass] = useState(`piece wp z-20 hidden`);
    const position = useRef(initialPosition);

    useEffect(() => {
        let piece : string
        if(color === 0){
            piece = `w${initial}`
        }else{
            piece = `b${initial}`
        }
        setMyClass(`piece ${piece} opacity-25 z-100 square${position.current.y}${position.current.x}`);
    },[])

    return(
        <button className = {myClass}  onClick={ e => { 
            e.stopPropagation();
            sendMove(color, arrayLocation, initialPosition)
        }}/>
    )
}

export default MoveSpot