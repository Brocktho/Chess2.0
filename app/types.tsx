export type Coordinates = {
    x : number,
    y : number
}

export type Pieces = {
    position: Coordinates,
    
}

export type Board = {
    whiteAttacks: Array<Coordinates>,
    blackAttacks: Array<Coordinates>,
    whitePieces: Array<Pieces>,

}