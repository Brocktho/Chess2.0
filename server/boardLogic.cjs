const {
    WhitePawn,
    WhiteBishop,
    WhiteQueen,
    WhiteKing,
    WhiteHorse,
    WhiteRook,
  } = require("./pieces/WhitePieces.cjs");
  const {
    BlackPawn,
    BlackBishop,
    BlackQueen,
    BlackKing,
    BlackHorse,
    BlackRook,
  } = require("./pieces/BlackPieces.cjs");

class Board {
    whitePieces;
    blackPieces;
    whiteHistory;
    blackHistory;
    whiteAttacks;
    blackAttacks;
    whiteKing;
    blackKing;
    whiteCasts;
    blackCasts;
    whiteLocations;
    blackLocations;

    constructor(){
        this.whitePieces = Array.apply(null, Array(2)).map((a, y) => {
            return Array.apply(null, Array(8)).map((b, x) => {
              let thisPosition = {
                x: x,
                y: y,
              };
              switch (y) {
                case 1:
                  return new WhitePawn(thisPosition, `BlackPawn${x}`);
                case 0:
                  switch (x) {
                    case 0:
                      return new WhiteRook(thisPosition, `BlackRook${x}`);
                    case 1:
                      return new WhiteHorse(thisPosition, `BlackHorse${x}`);
                    case 2:
                      return new WhiteBishop(thisPosition, `BlackBishop${x}`);
                    case 3:
                      return new WhiteQueen(thisPosition, `BlackQueen`);
                    case 4:
                      return new WhiteKing(thisPosition, `BlackKing`);
                    case 5:
                      return new WhiteBishop(thisPosition, `BlackBishop${x}`);
                    case 6:
                      return new WhiteHorse(thisPosition, `BlackHorse${x}`);
                    case 7:
                      return new WhiteRook(thisPosition, `BlackRook${x}`);
                  }
              }
            });
          });

        this.blackPieces = Array.apply(null, Array(2)).map((a, y) => {
            return Array.apply(null, Array(8)).map((b, x) => {
              let thisPosition = {
                x: x,
                y: y,
              };
              switch (y) {
                case 1:
                  return new BlackPawn(thisPosition, `BlackPawn${x}`);
                case 0:
                  switch (x) {
                    case 0:
                      return new BlackRook(thisPosition, `BlackRook${x}`);
                    case 1:
                      return new BlackHorse(thisPosition, `BlackHorse${x}`);
                    case 2:
                      return new BlackBishop(thisPosition, `BlackBishop${x}`);
                    case 3:
                      return new BlackQueen(thisPosition, `BlackQueen`);
                    case 4:
                      return new BlackKing(thisPosition, `BlackKing`);
                    case 5:
                      return new BlackBishop(thisPosition, `BlackBishop${x}`);
                    case 6:
                      return new BlackHorse(thisPosition, `BlackHorse${x}`);
                    case 7:
                      return new BlackRook(thisPosition, `BlackRook${x}`);
                  }
              }
            });
          });

          this.whiteHistory = [];
          this.blackHistory = [];
          this.whiteKing = 60;
          this.blackKing = 4;
          this.whiteLocations = this.generateInitialWhitePositions();
          this.blackLocations = this.generateInitialBlackPositions();
    }

    generateInitialWhitePositions(){
        let positions = [];
        this.whitePieces.forEach(pieceRow => {
            pieceRow.forEach(piece => {
                const MAP = ( piece.position.y * 8 ) + piece.position.x;
                positions.push(MAP);
            });
        });
        return positions;
    }

    generateInitialBlackPositions(){
        let positions = [];
        this.blackPieces.forEach(pieceRow => {
            pieceRow.forEach(piece => {
                const MAP = ( piece.position.y * 8 ) + piece.position.x;
                positions.push(MAP);
            });
        });
        return positions;
    }

    generateInitialWhiteCasts(){
        let validCasts = [];
        this.whitePieces.forEach(pieceRow => {
            pieceRow.forEach(piece => {
                let moves = piece.generateMoves();
                moves.forEach(vector => {
                    let chunk = [];
                    vector.every(move => {
                        const MAP = ( move.position.y * 8 ) + move.position.x
                        if(this.whiteLocations.includes(MAP)){
                            return false;
                        }else{
                            chunk.push(MAP);
                            return true;
                        }
                    });
                    if(chunk.length > 0){
                        validCasts.push(chunk);
                    }
                });
            });
        });
    }
}