export{}
/* import { useState, useEffect } from 'react';
import type { Coordinates, InternetPiece } from "~/types";

export const WhiteRook = ({initialPosition, notifyBoard}:{initialPosition:Coordinates, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wr `);
    const [position, setPosition] = useState(initialPosition);

    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wr square${newLocation.y}${newLocation.x}`;
        setPosition(newLocation);
        setMyClass(newClass);
    }
    
    const thisRook : InternetPiece = {
        position: position,
        moves: [],
        color: 0,
        update: getUpdated,
        initial: "r",
        alive: true,
        id: `whiteRook${position.x}`
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.y}${position.x}`);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(thisRook);
        }}/>
    )
}

export const WhiteQueen = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;
    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece wq `);
    const [position, setPosition] = useState(initialPosition);


    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece wq square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    const thisQueen: InternetPiece = {
      position: position,
      moves: [],
      color: 0,
      update: getUpdated,
      initial: "q",
      alive: true,
      id: `WhiteQueen${position.x}`
    };
  
    useEffect(() => {
      setMyClass(`${myClass} square${position.y}${position.x}`);
    }, []);
  
    return (
      <button
        className={myClass}
        onClick={(e) => {
          e.stopPropagation();
          notifyBoard(thisQueen);
        }}
      />
    );
  };

  export const WhitePawn = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;

    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece wp `);
    const [position, setPosition] = useState<Coordinates>(initialPosition);
  
    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece wp square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    const thisPawn: InternetPiece = {
      position: position,
      moves: [],
      color: 0,
      update: getUpdated,
      initial: "p",
      alive: true,
      id: `WhitePawn${position.x}`
    };
  
    useEffect(() => {
      setMyClass(`${myClass} square${position.y}${position.x}`);
    }, []);
  
    return (
      <button
        className={myClass}
        onClick={(e) => {
          e.stopPropagation();
          notifyBoard(thisPawn);
        }}
      />
    );
  };

  export const WhiteKing = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;

    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece wk `);
    const [position, setPosition] = useState(initialPosition);

    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece wk square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    const thisKing: InternetPiece = {
      position: position,
      moves: [],
      color: 0,
      update: getUpdated,
      initial: "k",
      alive: true,
      id: `WhiteKing`
    };
  
    useEffect(() => {
      setMyClass(`${myClass} square${position.y}${position.x}`);
    }, []);
  
    return (
      <button
        className={myClass}
        onClick={(e) => {
          e.stopPropagation();
          notifyBoard(thisKing);
        }}
      />
    );
  };

  export const WhiteHorse = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;

    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece wh `);
    const [position, setPosition] = useState(initialPosition);

    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece wh square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    let thisHorse: InternetPiece = {
      position: position,
      moves: [],
      color: 0,
      update: getUpdated,
      initial: "h",
      alive: true,
      id: `WhiteHorse${position.x}`
    };
  
    useEffect(() => {
      setMyClass(`${myClass} square${position.y}${position.x}`);
    }, []);
  
    return (
      <button
        className={myClass}
        onClick={(e) => {
          e.stopPropagation();
          notifyBoard(thisHorse);
        }}
      />
    );
  };

  export const WhiteBishop = ({initialPosition, notifyBoard}:{initialPosition:Coordinates, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece wb `);
    const [position, setPosition] = useState(initialPosition);
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece wb square${newLocation.y}${newLocation.x}`;
        setPosition(newLocation);
        setMyClass(newClass);
    }

    const thisBishop : InternetPiece = {
        position: position,
        moves: [],
        color: 0,
        update: getUpdated,
        initial: "b",
        alive: true,
        id: `WhiteBishop${position.x}`
    }

    useEffect(() => {
        setMyClass(`${myClass} square${position.y}${position.x}`);
    },[])

    return(
        <button className = {myClass} onClick={ e => { 
            e.stopPropagation();
            notifyBoard(thisBishop);
        }}/>
    )
} */