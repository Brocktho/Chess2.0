import { useState, useEffect } from 'react';
import type { Coordinates, InternetPiece } from "~/types";

export const BlackRook = ({initialPosition, notifyBoard}:{initialPosition:Coordinates, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece br `);
    const [position, setPosition] = useState(initialPosition);
    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece br square${newLocation.y}${newLocation.x}`;
        setPosition(newLocation);
        setMyClass(newClass);
    }
    
    const thisRook : InternetPiece = {
        position: position,
        moves: [],
        color: 1,
        update: getUpdated,
        initial: "r",
        alive: true,
        id: `BlackRook${position.x}`
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

export const BlackQueen = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;
    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece bq `);
    const [position, setPosition] = useState(initialPosition);

    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece bq square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    const thisQueen: InternetPiece = {
      position: position,
      moves: [],
      color: 1,
      update: getUpdated,
      initial: "q",
      alive: true,
      id: `BlackQueen${position.x}`
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

  export const BlackPawn = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;
    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece bp `);
    const [position, setPosition] = useState<Coordinates>(initialPosition);
  
    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece bp square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    const thisPawn: InternetPiece = {
      position: position,
      moves: [],
      color: 1,
      update: getUpdated,
      initial: "p",
      alive: true,
      id: `BlackPawn${position.x}`
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

  export const BlackKing = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;
    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece bk `);
    const [position, setPosition] = useState(initialPosition)

    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece bk square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    const thisKing: InternetPiece = {
      position: position,
      moves: [],
      color: 1,
      update: getUpdated,
      initial: "k",
      alive: true,
      id: `BlackKing`
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

  export const BlackHorse = ({
    initialPosition,
    notifyBoard,
  }: {
    initialPosition: Coordinates;
    notifyBoard: Function;
  }) => {
    const [myClass, setMyClass] = useState(`piece bh `);
    const [position, setPosition] = useState(initialPosition);

    const getUpdated = (newLocation: Coordinates) => {
      let newClass = `piece bh square${newLocation.y}${newLocation.x}`;
      setPosition(newLocation);
      setMyClass(newClass);
    };
  
    let thisHorse: InternetPiece = {
      position: position,
      moves: [],
      color: 1,
      update: getUpdated,
      initial: "h",
      alive: true,
      id: `BlackHorse${position.x}`
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

  export const BlackBishop = ({initialPosition, notifyBoard}:{initialPosition:Coordinates, notifyBoard:Function}) => {
    const [myClass, setMyClass] = useState(`piece bb `);
    const [position, setPosition] = useState(initialPosition);

    const getUpdated = (newLocation : Coordinates) => {
        let newClass = `piece bb square${newLocation.y}${newLocation.x}`;
        setPosition(newLocation);
        setMyClass(newClass);
    }

    const thisBishop : InternetPiece = {
        position: position,
        moves: [],
        color: 1,
        update: getUpdated,
        initial: "b",
        alive: true,
        id: `BlackBishop${position.x}`
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
}