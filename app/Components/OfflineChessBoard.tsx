import React, {useEffect, useState, useRef} from 'react';
import WhiteRook from '~/Pieces/WhiteRook';
import WhiteHorse from '~/Pieces/WhiteHorse';
import WhiteBishop from '~/Pieces/WhiteBishop';
import WhiteQueen from '~/Pieces/WhiteQueen';
import WhiteKing from '~/Pieces/WhiteKing';
import WhitePawn from '~/Pieces/WhitePawn';
import BlackRook from '~/Pieces/BlackRook';
import BlackHorse from '~/Pieces/BlackHorse';
import BlackBishop from '~/Pieces/BlackBishop';
import BlackQueen from '~/Pieces/BlackQueen';
import BlackKing from '~/Pieces/BlackKing';
import BlackPawn from '~/Pieces/BlackPawn';
import MoveSpot from '~/Pieces/MoveSpot';
import type { Coordinates, Board, Piece, Notifier, Movement } from "~/types";
import invariant from 'tiny-invariant';


const OfflineChessBoard = () => {
    const [player, setPlayer] = useState<number | null>(null);
    const displayPlayer = useRef<string | null>(null);
    const boardState = useRef<Board | null>(null)
    const [loading, setLoading] = useState(false);
    const [moveBubbles, setMoveBubbles] = useState<Array<JSX.Element> | null>(null);
    const turns = useRef<number>(1);

    const killCoord : Coordinates = {
        x: -999,
        y: -999
    }
    const [inCheck, setInCheck] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const lastMove = useRef<Movement>({
        initialPosition: killCoord,
        endPosition: killCoord,
        special: false,
        initial: "none",
        color: 2,
    });

    const checkKing = () => {
        if(turns.current%2 === 0){
            invariant(boardState.current, "must be true");
            let kingPos = boardState.current.whitePieces[1][4].position;
            let kingMap = (kingPos.y*8) + kingPos.x;
            if(boardState.current.blackAttacks.includes(kingMap)){
                setInCheck(true);
            }
        }
    };

    const xToString = (x : number) => {
        switch(x){
            case 0:
                return "a";
            case 1: 
                return "b";
            case 2:
                return "c";
            case 3:
                return "d";
            case 4:
                return "e";
            case 5:
                return "f";
            case 6:
                return "g";
            default:
                return "h";
        }
    }

    const generatePositionMap = async () => {
        invariant(boardState.current)
        boardState.current.whitePositions = [];
        boardState.current.whitePieces.forEach((pieces : Array<Piece>, index : number) => {
            pieces.forEach((piece : Piece) => {
                if(piece.alive){
                    invariant(boardState.current, "bruh");
                    let pieceMap = (piece.position.y*8) + piece.position.x;
                    boardState.current.whitePositions.push(pieceMap);
                }else{
                }
            })
        })
        boardState.current.blackPositions = [];
        boardState.current.blackPieces.forEach( (pieces : Array<Piece>) => {
            pieces.forEach( (piece : Piece) => {
                if(piece.alive){
                    invariant(boardState.current, "bruh");
                    boardState.current.blackPositions.push((piece.position.y*8) + piece.position.x);
                }
            })
        })
        boardState.current.whitePieces.forEach((pieces : Array<Piece>) => {
            pieces.forEach((piece : Piece) => {
                if(piece.alive){
                    let possibleMoves : Array<Array<Coordinates>>  = piece.generateMoves();
                    let trueMoves : Array<number> = [];
                    let possibleAttacks : Array<Coordinates> = [];
                    if(piece.generateAttacks){
                        possibleAttacks  = piece.generateAttacks();
                    }
                    possibleMoves.forEach((chunk : Array<Coordinates>) => { 
                        chunk.every((coord : Coordinates) => {
                            invariant(boardState.current, "board exists");
                            let pieceMap = ((coord.y*8) + coord.x);
                            if(!boardState.current.whitePositions.includes(pieceMap)){
                                if(piece.initial === "p"){
                                    if(!boardState.current.blackPositions.includes(pieceMap)){
                                        trueMoves.push(pieceMap);
                                        return true;
                                    }else{
                                        return false;
                                    }
                                }
                                if(boardState.current.blackPositions.includes(pieceMap)){
                                    trueMoves.push(pieceMap);
                                    return false;
                                }
                                trueMoves.push(pieceMap);
                                return true;
                            }else{
                                return false;
                            }
                        })
                    })
                    if(piece.initial === "p"){
                        possibleAttacks.forEach( (coord : Coordinates) => {
                            invariant(boardState.current, "board exists");
                            let pieceMap = ((coord.y*8) + coord.x);
                            if(boardState.current.blackPositions.includes(pieceMap)){  
                                trueMoves.push(pieceMap);
                            }
                        })
                    }
                    trueMoves.forEach(move => {
                        invariant(boardState.current, "i swear");
                        boardState.current.whiteAttacks.push(move);
                    })
                }
            })
        });
        boardState.current.blackPieces.forEach( (pieces : Array<Piece>) => {
            pieces.forEach((piece : Piece) => {
                let possibleMoves : Array<Array<Coordinates>>  = piece.generateMoves();
                let trueMoves : Array<number> = [];
                let possibleAttacks : Array<Coordinates> = [];
                if(piece.alive){
                    if(piece.generateAttacks){
                        possibleAttacks  = piece.generateAttacks();
                    }
                    possibleMoves.forEach((chunk : Array<Coordinates>) => {
                        chunk.every((coord : Coordinates) => {
                            invariant(boardState.current, "board exists");
                            let pieceMap = ((coord.y*8) + coord.x);
                            if(!boardState.current.blackPositions.includes(pieceMap)){
                                if(piece.initial === "p"){
                                    if(!boardState.current.whitePositions.includes(pieceMap)){
                                        trueMoves.push(pieceMap);
                                        return true;
                                    }else{
                                        return false;
                                    }
                                }
                            }
                        })
                    });
                    if(piece.initial === "p"){
                        possibleAttacks.forEach( (coord : Coordinates) => {
                            invariant(boardState.current, "board exists");
                            let pieceMap = ((coord.y*8) + coord.x);
                            if(boardState.current.whitePositions.includes(pieceMap)){
                                trueMoves.push(pieceMap);
                            }
                        })
                    }
                }
                trueMoves.forEach(move => {
                    invariant(boardState.current, "i swear");
                    boardState.current.blackAttacks.push(move);
                })
            })
        })
    }
    const returnCapture = async (coordMap : number, color : number) => {
        invariant(boardState.current, "Board must be initialized");
        let found = false;
        if(color === 0){
            boardState.current.blackPieces.forEach(pieces => {
                if(!found){
                    pieces.forEach( (piece : Piece) => {
                        if(!found){
                            if((piece.position.y*8) + piece.position.x === coordMap){
                                piece.alive = false;
                                piece.update(killCoord);
                                piece.position = killCoord;
                                found = true;
                            }
                        }
                    })
                }
            })
        }else{
            boardState.current.whitePieces.forEach(pieces => {
                if(!found){
                    pieces.forEach( (piece : Piece) => {
                        if(!found){
                            if((piece.position.y*8) + piece.position.x === coordMap){
                                piece.alive = false;
                                piece.update(killCoord);
                                piece.position = killCoord;
                                found = true;
                            }
                        }
                    })
                }
            })
        }
    }

    const registerPiece = (piece: Piece) => {
        let color = piece.color;
        if(boardState.current === null){
            let newBoard : Board = {
                whiteAttacks: [],
                blackAttacks: [],
                whitePositions: [],
                blackPositions: [],
                whitePieces: [],
                blackPieces: [],
            }
            boardState.current = newBoard;
        }
        if(color === 0){
            if(piece.arrayLocation.x === 0){
                boardState.current.whitePieces.push([]);
                boardState.current.whitePieces[piece.arrayLocation.y].push(piece);
            }else{
                boardState.current.whitePieces[piece.arrayLocation.y].push(piece)
            }
            boardState.current.whitePositions.push( (piece.position.y*8) + piece.position.x )
        }
        if(color === 1){
            if(piece.arrayLocation.x === 0){
                boardState.current.blackPieces.push([]);
                boardState.current.blackPieces[piece.arrayLocation.y].push(piece);
            }else{
                boardState.current.blackPieces[piece.arrayLocation.y].push(piece)
            }
            boardState.current.blackPositions.push( (piece.position.y*8) + piece.position.x );
        }
    }
    
    const refreshDom = async () => {
        setMoveBubbles(null);
    }

    const generatePieceMoves = (piece : Piece) => {
        console.log(inCheck);
        if(piece.initial === "k"){
            let color = piece.color;
            let possibleMoves : Array<Array<Coordinates>>  = piece.generateMoves();
            let trueMoves : Array<Coordinates> = [];
            possibleMoves.forEach((chunk : Array<Coordinates>) => { 
                chunk.every((coord : Coordinates) => {
                    invariant(boardState.current, "board exists");
                    let pieceMap = ((coord.y*8) + coord.x);
                    if(color === 0){
                        if(!boardState.current.whitePositions.includes(pieceMap)){
                            if(boardState.current.blackAttacks.includes(pieceMap)){
                                return false;
                            }
                            if(boardState.current.blackPositions.includes(pieceMap)){
                                trueMoves.push(coord);
                                return false;
                            }
                            trueMoves.push(coord);
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        if(!boardState.current.blackPositions.includes(pieceMap)){
                            if(boardState.current.whiteAttacks.includes(pieceMap)){
                                return false;
                            }
                            if(boardState.current.whitePositions.includes(pieceMap)){
                                trueMoves.push(coord);
                                return false;
                            }
                            trueMoves.push(coord);
                            return true;
                        }else{
                            return false;
                        }
                    }
                })
            })
            if(trueMoves.length === 0 && inCheck){
                setGameOver(true);
                return;
            }
            while(loading){
                //do nothing
            }
            return trueMoves;
        }else{
            if(piece.alive && !inCheck){
                let color = piece.color;
                let possibleMoves : Array<Array<Coordinates>>  = piece.generateMoves();
                let trueMoves : Array<Coordinates> = [];
                let possibleAttacks : Array<Coordinates> = [];
                if(piece.generateAttacks){
                    possibleAttacks  = piece.generateAttacks();
                }
                possibleMoves.forEach((chunk : Array<Coordinates>) => { 
                    chunk.every((coord : Coordinates) => {
                        invariant(boardState.current, "board exists");
                        let pieceMap = ((coord.y*8) + coord.x);
                        if(color === 0){
                            if(!boardState.current.whitePositions.includes(pieceMap)){
                                if(piece.initial === "p"){
                                    if(!boardState.current.blackPositions.includes(pieceMap)){
                                        trueMoves.push(coord);
                                        return true;
                                    }else{
                                        return false;
                                    }
                                }
                                if(boardState.current.blackPositions.includes(pieceMap)){
                                    trueMoves.push(coord);
                                    return false;
                                }
                                trueMoves.push(coord);
                                return true;
                            }else{
                                return false;
                            }
                        }else{
                            if(!boardState.current.blackPositions.includes(pieceMap)){
                                if(piece.initial === "p"){
                                    if(!boardState.current.whitePositions.includes(pieceMap)){
                                        trueMoves.push(coord);
                                        return true;
                                    }else{
                                        return false;
                                    }
                                }
                                if(boardState.current.whitePositions.includes(pieceMap)){
                                    trueMoves.push(coord);
                                    return false;
                                }
                                trueMoves.push(coord);
                                return true;
                            }else{
                                return false;
                            }
                        }
                    })
                })
                if(piece.initial === "p"){
                    possibleAttacks = possibleAttacks.map( (coord : Coordinates) => {
                        invariant(boardState.current, "board exists");
                        let pieceMap = ((coord.y*8) + coord.x);
                        if(color === 0){
                            if(boardState.current.blackPositions.includes(pieceMap)){  
                                return coord;
                            }
                            if(lastMove.current.color === 1 && lastMove.current.special){
                                if(lastMove.current.endPosition.y === coord.y+1){
                                    if(lastMove.current.endPosition.x === coord.x){
                                        return coord;
                                    }
                                }
                            }
                        }else{
                            if(boardState.current.whitePositions.includes(pieceMap)){
                                return coord;
                            }
                            if(lastMove.current.color === 0 && lastMove.current.special){
                                if(lastMove.current.endPosition.y === coord.y-1){
                                    if(lastMove.current.endPosition.x === coord.x){
                                        return coord;
                                    }
                                }
                            }
                        }
                        return killCoord
                    })
                }
                return trueMoves.concat(possibleAttacks);
            }
            return [];
        }
    }

    const sendMove = async (color : number, arrayLocation : Coordinates, newLocation : Coordinates) => {
        invariant(boardState.current, "Board State must be initialized");
        let callingPiece : Piece | null = null;
        if(color === 0 && turns.current%2 === 1){
            callingPiece = boardState.current.whitePieces[arrayLocation.y][arrayLocation.x];
        }
        if(color === 1 && turns.current%2 === 0){
            callingPiece = boardState.current.blackPieces[arrayLocation.y][arrayLocation.x];
        }
        invariant(callingPiece, "Piece must be found");
        await refreshDom();
        if(callingPiece.initial === "p"){
            if(lastMove.current.special){
                if(color === 0){
                    if(newLocation.y+1 === lastMove.current.endPosition.y){
                        if(newLocation.x === lastMove.current.endPosition.x){
                            await returnCapture(((lastMove.current.endPosition.y*8) + lastMove.current.endPosition.x), color);
                        }
                    }
                }else{
                    if(newLocation.y-1 === lastMove.current.endPosition.y){
                        if(newLocation.x === lastMove.current.endPosition.x){
                            await returnCapture(((lastMove.current.endPosition.y*8) + lastMove.current.endPosition.x), color);
                        }
                    }
                }
            }
        }
        lastMove.current = {
            initialPosition: callingPiece.position,
            endPosition: newLocation,
            special: callingPiece.special,
            initial: callingPiece.initial,
            color: callingPiece.color
        }
        let trueX  = xToString(callingPiece.position.x);
        
        let previousPosition = `${callingPiece.initial}${trueX}${callingPiece.position.y}`;
        callingPiece.position = newLocation;
        callingPiece.special = false;
        let newX = xToString(callingPiece.position.x);
        let nextPosition = `${callingPiece.initial}${newX}${callingPiece.position.y}`;
        let pieceAccess = {
            location: callingPiece.arrayLocation,
            color: callingPiece.color,
        }
        let serverPiece = {
            prev: previousPosition,
            next: nextPosition,
            nextLocation: newLocation,
            access: pieceAccess,
        }

        let coordMap = (callingPiece.position.y*8) + (callingPiece.position.x);
        if((boardState.current.whitePositions.includes(coordMap)) || (boardState.current.blackPositions.includes(coordMap))){
            await returnCapture(coordMap, color);
        }

        callingPiece.update(newLocation);
        turns.current++
    }

    const receiveMove = async (color : number, arrayLocation : Coordinates, newLocation : Coordinates) => {
        invariant(boardState.current, "Board State must be initialized");
        let callingPiece : Piece | null = null;
        if(color === 0){
            callingPiece = boardState.current.whitePieces[arrayLocation.y][arrayLocation.x];
        }
        if(color === 1){
            callingPiece = boardState.current.blackPieces[arrayLocation.y][arrayLocation.x];
        }
        invariant(callingPiece, "Piece must be found");
        await refreshDom();
        if(callingPiece.initial === "p"){
            if(lastMove.current.special){
                if(color === 0){
                    if(newLocation.y+1 === lastMove.current.endPosition.y){
                        if(newLocation.x === lastMove.current.endPosition.x){
                            await returnCapture(((lastMove.current.endPosition.y*8) + lastMove.current.endPosition.x), color);
                        }
                    }
                }else{
                    if(newLocation.y-1 === lastMove.current.endPosition.y){
                        if(newLocation.x === lastMove.current.endPosition.x){
                            await returnCapture(((lastMove.current.endPosition.y*8) + lastMove.current.endPosition.x), color);
                        }
                    }
                }
            }
        }
        lastMove.current = {
            initialPosition: callingPiece.position,
            endPosition: newLocation,
            special: callingPiece.special,
            initial: callingPiece.initial,
            color: callingPiece.color
        }
        callingPiece.position = newLocation;
        callingPiece.special = false;

        let coordMap = (callingPiece.position.y*8) + (callingPiece.position.x);
        if((boardState.current.whitePositions.includes(coordMap)) || (boardState.current.blackPositions.includes(coordMap))){
            await returnCapture(coordMap, color);
        }
        turns.current++
        callingPiece.update(newLocation);

    }

    const receiveAlert = async (event:React.MouseEvent, notified:Notifier ) => {
        await refreshDom();
        let color = notified.color;
        invariant(boardState.current, "Board must be initialized");
        let moves : Array<Coordinates>;
        let callingPiece : Piece;
        if(color === 0 && turns.current%2 === 1){
            callingPiece = boardState.current.whitePieces[notified.arrayLocation.y][notified.arrayLocation.x];
        }
        else if(color === 1 && turns.current%2 === 0){
            callingPiece = boardState.current.blackPieces[notified.arrayLocation.y][notified.arrayLocation.x]
        }
        else{
            callingPiece = {
                position: killCoord,
                moves: [],
                color:2,
                update: function(){},
                generateMoves:() => {return killCoord},
                alive: false,
                arrayLocation: killCoord,
                initial: "none",
            }
        }
        moves = generatePieceMoves(callingPiece) as Array<Coordinates>;
        let bubbles = moves.map( (move,index) => {
            return (<MoveSpot initialPosition={move} key={`MoveSpot${index}`} initial={callingPiece.initial} color={color} arrayLocation={notified.arrayLocation} sendMove={sendMove}/>)
        })
        setMoveBubbles(bubbles);
    }

    const blackPieces = Array.apply(null, Array(2)).map( 
        (a, y) => {
            return(
                Array.apply(null, Array(8)).map( 
                    (b, x) => {
                        let thisPosition : Coordinates = {
                            x:x,
                            y:y
                        }
                        switch(y){
                        case 1:
                            return(<BlackPawn initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert}  key={`BlackPawn${x}`}/>)
                        case 0:
                            switch(x){
                                case 0:
                                    return(<BlackRook initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackRook${x}`}/>)
                                case 1:
                                    return(<BlackHorse initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackHorse${x}`}/>)
                                case 2:
                                    return(<BlackBishop initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackBishop${x}`}/>)
                                case 3:
                                    return(<BlackQueen initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackQueen${x}`}/>)
                                case 4:
                                    return(<BlackKing initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackKing${x}`}/>)
                                case 5:
                                    return(<BlackBishop initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackBishop${x}`}/>)
                                case 6:
                                    return(<BlackHorse initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackHorse${x}`}/>)
                                case 7: 
                                    return(<BlackRook initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`BlackRook${x}`}/>)
                                default:
                                    return(<BlackPawn initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert}  key={`BlackPawn${x}`}/>)
                            }
                            default:
                                return(<BlackPawn initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert}  key={`BlackPawn${x}`}/>)
                        }
                    }
                )
            )
        }
    )
    const whitePieces = Array.apply(null, Array(2)).map( 
        (a, y) => {
            return(
                Array.apply(null, Array(8)).map( 
                    (b, x) => {
                        let thisPosition : Coordinates = {
                            x: x,
                            y:y+6
                        }
                        switch(y){
                        case 0:
                            return(<WhitePawn initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert}  key={`WhitePawn${x}`}/>)
                        case 1:
                            switch(x){
                                case 0:
                                    return(<WhiteRook initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`WhiteRook${x}`}/>)
                                case 1:
                                    return(<WhiteHorse initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`WhiteHorse${x}`}/>)
                                case 2:
                                    return(<WhiteBishop initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`WhiteBishop${x}`}/>)
                                case 3:
                                    return(<WhiteQueen initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`WhiteQueen${x}`}/>)
                                case 4:
                                    return(<WhiteKing initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`WhiteKing${x}`}/>)
                                case 5:
                                    return(<WhiteBishop initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert}  key={`WhiteBishop${x}`}/>)
                                case 6:
                                    return(<WhiteHorse initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert}  key={`WhiteHorse${x}`}/>)
                                case 7: 
                                    return(<WhiteRook initialPosition={thisPosition} updateBoard={registerPiece} notifyBoard={receiveAlert} key={`WhiteRook${x}`}/>)

                            }
                        }
                    }
                )
            )
        }
    )

    useEffect(() => {
       async () => {
           console.log("starting");
        setLoading(true);
        await generatePositionMap();
        checkKing();
        setLoading(false);
        console.log("finished");
        }
    }, [turns.current])

    return(
        <div className="flex flex-col gap-2">
            {player ? 
            <h1 className="text-white">{displayPlayer.current}</h1>
            : 
            <h1 className="text-white">Not Initialized please refresh your browser</h1>
            }
            <div className="board bg-slate-800" onClick={async e => await refreshDom()}>
                {blackPieces}
                {whitePieces}
                {moveBubbles}
            </div>
        </div>
    )
}

export default OfflineChessBoard;