import { useState, useEffect, useRef } from 'react';
import { Coordinates } from "~/types";

const BlackRook = ({initialPosition}:{initialPosition:Coordinates}) => {
    const [myClass, setMyClass] = useState(`piece br `);
    const position = useRef(initialPosition);

    useEffect(() => {
        setMyClass(`${myClass} square${position.current.y}${position.current.x}`);
    },[])

    return(
        <button className = {myClass}/>
    )
}

export default BlackRook