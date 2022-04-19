import React, {useEffect, useState, useRef, ReactElement} from 'react';
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
import { Coordinates, Board, Piece, Notifier, Movement } from "~/types";
import invariant from 'tiny-invariant';


const ChessBoard = () => {
    const boardState = useRef<Board | null>(null)
    const [moveBubbles, setMoveBubbles] = useState<Array<JSX.Element> | null>(null);
    const [turn, setTurn] = useState<boolean>(false);
    const killCoord : Coordinates = {
        x: -999,
        y: -999
    }
    let lastMove = useRef<Movement>({
        initialPosition: killCoord,
        endPosition: killCoord,
        special: false,
        initial: "none",
        color: 2,
    });

    const generatePositionMap = () => {
        invariant(boardState.current)
        boardState.current.whitePositions = [];
        boardState.current.whitePieces.forEach((pieces : Array<Piece>) => {
            pieces.forEach((piece : Piece) => {
                if(piece.alive){
                    invariant(boardState.current, "bruh");
                    boardState.current.whitePositions.push((piece.position.y*8) + piece.position.x);
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
    }
    const returnCapture = (coordMap : number, color : number) => {
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
                                boardState.current?.blackPositions
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
        if(piece.alive){
            let color = piece.color;
            let possibleMoves : Array<Coordinates>  = piece.generateMoves();
            let possibleAttacks : Array<Coordinates> = [];
            if(piece.generateAttacks){
                possibleAttacks  = piece.generateAttacks();
            }
            possibleMoves = possibleMoves.map( (coord : Coordinates) => {
                invariant(boardState.current, "board exists");
                let pieceMap = ((coord.y*8) + coord.x);
                if(color === 0){
                    if(!boardState.current.whitePositions.includes(pieceMap)){
                        if(piece.initial === "p"){
                            if(!boardState.current.blackPositions.includes(pieceMap)){
                                return coord;
                            }else{
                                return killCoord;
                            }
                        }
                        console.log('')
                        console.log(coord);
                        console.log(piece.initial);
                        return coord;
                    }
                }else{
                    if(!boardState.current.blackPositions.includes(pieceMap)){
                        if(piece.initial === "p"){
                            if(!boardState.current.whitePositions.includes(pieceMap)){
                                return coord;
                            }else{
                                return killCoord;
                            }
                        }
                        return coord;
                    }
                }
                return killCoord
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
            return possibleMoves.concat(possibleAttacks);
        }
        return [];
    }

    const sendMove = async (color : number, arrayLocation : Coordinates, newLocation : Coordinates) => {
        invariant(boardState.current, "Board State must be initialized");
        let callingPiece : Piece | null = null;
        if(color === 0 && !turn){
            callingPiece = boardState.current.whitePieces[arrayLocation.y][arrayLocation.x];
        }
        if(color === 1 && turn){
            callingPiece = boardState.current.blackPieces[arrayLocation.y][arrayLocation.x];
        }
        invariant(callingPiece, "Piece must be found");
        await refreshDom();
        setTurn(!turn);
        if(callingPiece.initial === "p"){
            if(lastMove.current.special){
                if(color === 0){
                    if(newLocation.y+1 === lastMove.current.endPosition.y){
                        if(newLocation.x === lastMove.current.endPosition.x){
                            returnCapture(((lastMove.current.endPosition.y*8) + lastMove.current.endPosition.x), color);
                        }
                    }
                }else{
                    if(newLocation.y-1 === lastMove.current.endPosition.y){
                        if(newLocation.x === lastMove.current.endPosition.x){
                            returnCapture(((lastMove.current.endPosition.y*8) + lastMove.current.endPosition.x), color);
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
        callingPiece.update(newLocation);
        let coordMap = (callingPiece.position.y*8) + (callingPiece.position.x);
        if((boardState.current.whitePositions.includes(coordMap)) || (boardState.current.blackPositions.includes(coordMap))){
            returnCapture(coordMap, color);
        }
    }

    const receiveAlert = async (event:React.MouseEvent, notified:Notifier ) => {
        await refreshDom();
        let color = notified.color;
        invariant(boardState.current, "Board must be initialized");
        let moves : Array<Coordinates>;
        let callingPiece : Piece;
        if(color === 0 && !turn){
            callingPiece = boardState.current.whitePieces[notified.arrayLocation.y][notified.arrayLocation.x];
        }
        else if(color === 1 && turn){
            callingPiece = boardState.current.blackPieces[notified.arrayLocation.y][notified.arrayLocation.x]
        }
        else{
            callingPiece = {
                position: {x:-100, y:-100},
                moves: [],
                color:2,
                update: function(){},
                alive: false,
                arrayLocation: {x:-100, y:-100},
                initial: "none",
            }
        }
        console.log(callingPiece.position);
        moves = generatePieceMoves(callingPiece) as Array<Coordinates>;
        console.log(moves);
        if(moves.length > 0 && moves[1] !== undefined){
            let bubbles = moves.map( (move,index) => {
                return (<MoveSpot initialPosition={move} key={`MoveSpot${index}`} initial={callingPiece.initial} color={color} arrayLocation={notified.arrayLocation} sendMove={sendMove}/>)
            })
            setMoveBubbles(bubbles);
        }
    }

    const blackPieces = Array.apply(null, Array(2)).map( 
        (a, y) => {
            return(
                Array.apply(null, Array(8)).map( 
                    (b, x) => {
                        let thisPosition : Coordinates = {
                            x,y
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

                            }
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
                            x,y:y+6
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
        console.log(boardState.current);
        generatePositionMap();
    }, [turn])
    return(
        <div className="board bg-slate-800" onClick={async e => await refreshDom()}>
            {blackPieces}
            {whitePieces}
            {moveBubbles}
        </div>
    )
}

export default ChessBoard