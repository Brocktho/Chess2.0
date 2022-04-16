import React, {useState} from 'react';

const MoveSpot = ({initialPosition}:{initialPosition:number}) => {
    const [position, setPosition] = useState(initialPosition)
    const square = `square${position}`
    return(
        <div id="MoveSpot" className = {`piece wp ${square}`}/>
    )
}

export default MoveSpot