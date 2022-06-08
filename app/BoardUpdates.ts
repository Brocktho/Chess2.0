import type { BoardState, BoardAction, MoveCast } from "~/types";
import type { PieceRef } from "./Pieces/types";
const BoardUpdates = (state : BoardState, action : BoardAction) : BoardState => {
    switch(action.type){
        case "registerWhitePiece":
                if ( state.player === 0){
                    if(action.piece.color === 0){
                        let newPieceRef : PieceRef;
                        let newCast : MoveCast;
                        switch(action.piece.initial){
                            case "p":
                                newPieceRef = {
                                    update: action.piece.update,
                                    index: action.piece.index,
                                    position: action.piece.position.y * 8 + action.piece.position.x,
                                    generateMoves: action.piece.generateMoves,
                                    generateAttacks: action.piece.generateAttacks,
                                    initial: "p"
                                }
                                let PawnCast = [...action.piece.generateMoves(), ...action.piece.generateAttacks()]
                                newCast = {
                                    index: action.piece.index,
                                    cast: PawnCast
                                }
                                break;
                            default: 
                                newPieceRef = {
                                    update: action.piece.update,
                                    index: action.piece.index,
                                    position: action.piece.position.y * 8 + action.piece.position.x,
                                    generateMoves: action.piece.generateMoves,
                                    initial: action.piece.initial
                                }
                                let GenericCast = [...action.piece.generateMoves()]
                                newCast = {
                                    index: action.piece.index,
                                    cast: GenericCast
                                }
                                break;
                        }                        
                        state.whiteRefs.push(newPieceRef)
                        state.whiteCasts.push(newCast);
                    }
                }
            break;
        
        case "registerBlackPiece":
            if( state.player === 1){
                if(action.piece.color === 1){
                    let newPieceRef : PieceRef;
                        let newCast : MoveCast;
                        switch(action.piece.initial){
                            case "p":
                                newPieceRef = {
                                    update: action.piece.update,
                                    index: action.piece.index,
                                    position: action.piece.position.y * 8 + action.piece.position.x,
                                    generateMoves: action.piece.generateMoves,
                                    generateAttacks: action.piece.generateAttacks,
                                    initial: "p"
                                }
                                let PawnCast = [...action.piece.generateMoves(), ...action.piece.generateAttacks()]
                                newCast = {
                                    index: action.piece.index,
                                    cast: PawnCast
                                }
                                break;
                            default: 
                                newPieceRef = {
                                    update: action.piece.update,
                                    index: action.piece.index,
                                    position: action.piece.position.y * 8 + action.piece.position.x,
                                    generateMoves: action.piece.generateMoves,
                                    initial: action.piece.initial
                                }
                                let GenericCast = [...action.piece.generateMoves()]
                                newCast = {
                                    index: action.piece.index,
                                    cast: GenericCast
                                }
                                break;
                        }
                    state.blackRefs.push(newPieceRef);
                    state.blackCasts.push(newCast);
                }
            }
            break;
        
        case "movePiece":
            
            break;

        case "castMoves":
            state.moveRefs = action.bubbles;
            break;
        
        case "refresh":
            state.moveRefs = null;
            break;

        default:

    }
    return state
}

export default BoardUpdates;