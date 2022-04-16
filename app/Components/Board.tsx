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
import { Coordinates, Board } from "~/types";


const ChessBoard = () => {
    const boardState = useRef<Board | null>(null)

    const registerPieces = () => {

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
                            return(<BlackPawn initialPosition={thisPosition}/>)
                        case 0:
                            switch(x){
                                case 0:
                                    return(<BlackRook initialPosition={thisPosition}/>)
                                case 1:
                                    return(<BlackHorse initialPosition={thisPosition}/>)
                                case 2:
                                    return(<BlackBishop initialPosition={thisPosition}/>)
                                case 3:
                                    return(<BlackQueen initialPosition={thisPosition}/>)
                                case 4:
                                    return(<BlackKing initialPosition={thisPosition}/>)
                                case 5:
                                    return(<BlackBishop initialPosition={thisPosition}/>)
                                case 6:
                                    return(<BlackHorse initialPosition={thisPosition}/>)
                                case 7: 
                                    return(<BlackRook initialPosition={thisPosition}/>)

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
                            return(<WhitePawn initialPosition={thisPosition}/>)
                        case 1:
                            switch(x){
                                case 0:
                                    return(<WhiteRook initialPosition={thisPosition}/>)
                                case 1:
                                    return(<WhiteHorse initialPosition={thisPosition}/>)
                                case 2:
                                    return(<WhiteBishop initialPosition={thisPosition}/>)
                                case 3:
                                    return(<WhiteQueen initialPosition={thisPosition}/>)
                                case 4:
                                    return(<WhiteKing initialPosition={thisPosition}/>)
                                case 5:
                                    return(<WhiteBishop initialPosition={thisPosition}/>)
                                case 6:
                                    return(<WhiteHorse initialPosition={thisPosition}/>)
                                case 7: 
                                    return(<WhiteRook initialPosition={thisPosition}/>)

                            }
                        }
                    }
                )
            )
        }
    )

    return(
        <div className="board">
            {blackPieces}
            {whitePieces}
        </div>
    )
}

export default ChessBoard