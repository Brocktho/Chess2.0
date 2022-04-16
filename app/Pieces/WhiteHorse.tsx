import { useState, useEffect, useRef } from 'react';
import { Coordinates } from "~/types";

const WhiteHorse = ({initialPosition}:{initialPosition:Coordinates}) => {
    const [myClass, setMyClass] = useState(`piece wh `);
    const position = useRef(initialPosition);

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
    },[])

    return(
        <button className = {myClass}/>
    )
}

export default WhiteHorse