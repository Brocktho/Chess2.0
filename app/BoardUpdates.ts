import type { BoardState, BoardAction } from "~/types";

const BoardUpdates = (state : BoardState, action : BoardAction) : BoardState => {
    switch(action.type){
        case "generateBoard":
            state.blackRefs = [{
                update: () => {},
                index: 0,
                position: 24,
            }]
            return {...state}

        case "movePiece":

        return {...state}
    }
}

export default BoardUpdates;