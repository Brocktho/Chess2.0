
class WhitePawn{
    position ;
    special ;
    id ;
    moves ;
    alive ;
    initial ;

    constructor(position , id ){
        this.position = position;
        this.id = id;
        this.special = true;
        this.alive = false;
        this.initial = "p";
        this.moves = [];
    }

    setMoves(moves ){
        this.moves = moves;
    }

    generateMoves(){
        let px = this.position.x;
        let py = this.position.y;
        let possibleMoves = [];
        let chunk = [];
        chunk.push({
        x: px,
        y: py - 1,
        });
        if (this.special) {
        chunk.push({
            x: px,
            y: py - 2,
        });
        }
        possibleMoves.push(chunk);
        return possibleMoves;
    }

    generateAttacks(){
        let px = this.position.x;
        let py = this.position.y;
        let possibleAttacks = [];
        possibleAttacks.push({
        x: px - 1,
        y: py - 1,
        });
        possibleAttacks.push({
        x: px + 1,
        y: py - 1,
        });
        return possibleAttacks;
    }

}

class WhiteBishop{
    position ;
    map ;
    id ;
    moves ;
    alive ;
    initial ;

    constructor(position , id ){
        this.position = position;
        this.map = ( position.y * 8 ) + position.x;
        this.id = id;
        this.moves = [];
        this.alive = true;
        this.initial = "b";
    }

    setMoves(moves ){
        this.moves = moves;
    }

    generateMoves(){
        let px = this.position.x;
        let py = this.position.y;
        let currentX = px;
        let currentY = py;
        let possibleMoves  = [];
        let chunk  = [];
        while(currentX < 7 && currentY < 7){
            currentX++
            currentY++ 
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        currentX = px;
        currentY = py;
        while(currentX < 7 && currentY > 0){
            currentX++
            currentY--
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        currentX = px;
        currentY = py;
        while(currentX > 0 && currentY < 7){
            currentX--
            currentY++
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        currentX = px;
        currentY = py;
        while(currentX > 0 && currentY > 0){
            currentX--
            currentY--
            chunk.push({
                x: currentX,
                y: currentY,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        return possibleMoves;
    }
}

class WhiteRook{
    position ;
    map ;
    special ;
    id ;
    moves ;
    alive ;
    initial ;

    constructor(position , id ){
        this.position = position;
        this.map = ( position.y * 8 ) + position.x;
        this.special = true;
        this.id = id;
        this.moves = [];
        this.alive = true;
        this.initial = 'r';
    }

    setMoves(moves ){
        this.moves = moves;
    }

    generateMoves(){
        let px = this.position.x;
        let py = this.position.y;
        let possibleMoves  = [];
        let chunk = [];
        while(px < 7){
            px++;
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        while(px > 0){
            px--
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        while(py < 7){
            py++
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        py = this.position.y;
        while(py > 0){
            py--
            chunk.push({
                x: px,
                y: py,
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        return possibleMoves; 
    }
}

class WhiteQueen{
    position ;
    map ;
    id ;
    moves ;
    alive ;
    initial ;

    constructor(position , id ){
        this.position = position;
        this.map = ( position.y * 8 ) + position.x;
        this.id = id;
        this.moves = [];
        this.alive = true;
        this.initial = 'q';
    }

    setMoves(moves ){
        this.moves = moves;
    }

    generateMoves(){
        let px = this.position.x;
        let py = this.position.y;
        let possibleMoves  = [];
        let chunk  = [];
        while(px < 7 && py < 7){
            px++;
            py++;
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        py = this.position.y;
        while(px < 7 && py > 0){
            px++
            py--
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        py = this.position.y;
        while(px > 0 && py < 7){
            px--
            py++
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        py = this.position.y;
        while(px > 0 && py > 0){
            px--
            py--
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        py = this.position.y;
        while(px > 0){
            px--
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        while(px < 7){
            px++
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        px = this.position.x;
        while(py < 7){
            py++
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        py = this.position.y;
        while(py > 0){
            py--
            chunk.push({
                x:px,
                y:py
            })
        }
        possibleMoves.push(chunk);
        return possibleMoves;
    }
}

class WhiteKing{
    position ;
    map ;
    id ;
    special ;
    moves ;
    alive ;
    initial ;

    constructor(position , id ){
        this.position = position;
        this.map = ( position.y * 8 ) + position.x;
        this.id = id;
        this.special = true;
        this.moves = [];
        this.alive = true;
        this.initial = 'q';
    }

    setMoves(moves ){
        this.moves = moves;
    }

    generateMoves(){
        let px = this.position.x;
        let py = this.position.y;
        let possibleMoves  = [];
        let chunk  = [];
        if(py < 7){
            chunk.push({
                x: px,
                y: py+1
            })
            possibleMoves.push(chunk);
            chunk = [];
            if(px < 7){
                chunk.push({
                    x: px+1,
                    y: py+1
                })
            }
            possibleMoves.push(chunk);
            chunk = [];
            if(px > 0){
                chunk.push({
                    x: px-1,
                    y: py+1
                })
            }
            possibleMoves.push(chunk);
            chunk = [];
        }
        if(py > 0){
            chunk.push({
                x: px,
                y: py-1
            })
            possibleMoves.push(chunk);
            chunk = [];
            if(px < 7){
                chunk.push({
                    x: px+1,
                    y: py-1
                })
            }
            possibleMoves.push(chunk);
            chunk = [];
            if(px > 0){
            chunk.push({
                x: px-1,
                y: py-1
            })
            }
            possibleMoves.push(chunk);
            chunk = [];
        }
        possibleMoves.push(chunk);
        chunk = [];
        if(px < 7){
            chunk.push({
                x: px+1,
                y: py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        if(px > 0){
            chunk.push({
                x: px-1,
                y: py
            })
        }
        possibleMoves.push(chunk);
        chunk = [];
        if(this.special){
            chunk.push({
                x: px+1,
                y: py
            });
            chunk.push({
                x: px+2,
                y: py
            });
            possibleMoves.push(chunk);
            chunk = [];
            chunk.push({
                x: px-1,
                y: py
            });
            chunk.push({
                x: px-2,
                y: py
            });
            chunk.push({
                x: px-3,
                y: py
            });
            possibleMoves.push(chunk);
        }
        return possibleMoves;
    }
}

class WhiteHorse{
    position ;
    map ;
    id ;
    moves ;
    alive ;
    initial ;

    constructor(position , id ){
        this.position = position;
        this.map = ( position.y * 8 ) + position.x;
        this.id = id;
        this.moves = [];
        this.alive = true;
        this.initial = 'q';
    }

    setMoves(moves ){
        this.moves = moves;
    }

    generateMoves(){
        let possibleMoves  = [];
        let px = this.position.x;
        let py = this.position.y;
        let possibleX = [];
        let possibleY = [];
        switch (px){
            case 0:
                possibleX.push(px+2);
                possibleX.push(px+1);
                break;
            case 1:
                possibleX.push(px-1);
                possibleX.push(px+1);
                possibleX.push(px+2);
                break;
            case 2:
            case 3: 
            case 4:
            case 5:
                possibleX.push(px-2);
                possibleX.push(px-1);
                possibleX.push(px+1);
                possibleX.push(px+2);
                break;
            case 6:
                possibleX.push(px-2);
                possibleX.push(px-1);
                possibleX.push(px+1);
                break;
            case 7:
                possibleX.push(px-2);
                possibleX.push(px-1);
            break;
        }
        switch (py){
            case 0: 
                possibleY.push(py+2);
                possibleY.push(py+1);
                break;
            case 1:
                possibleY.push(py+2);
                possibleY.push(py+1);
                possibleY.push(py-1);
                break;
            case 2: 
            case 3:
            case 4:
            case 5:
                possibleY.push(py-2);
                possibleY.push(py-1);
                possibleY.push(py+1);
                possibleY.push(py+2);
                break;
            case 6:
                possibleY.push(py-2);
                possibleY.push(py-1);
                possibleY.push(py+1);
                break;
            case 7:
                possibleY.push(py-2);
                possibleY.push(py-1);
        }
        let chunk  = [];
        possibleY.map(y => {
            possibleX.map(x => { 
                if(y === py+2 || y === py-2){
                    if(x === px+1 || x === px-1){
                        chunk = [];
                        chunk.push({
                            x: x,
                            y: y,
                        });
                        possibleMoves.push(chunk);
                    }
                }
                if(y === py+1 || y === py-1){
                    if( x === px+2 || x === px-2){
                        chunk = [];
                        chunk.push({
                            x: x,
                            y: y,
                        });
                        possibleMoves.push(chunk);
                    }
                }
            });
        });
    return possibleMoves;
    }
}

exports.WhitePawn = WhitePawn;
exports.WhiteBishop = WhiteBishop;
exports.WhiteKing = WhiteKing;
exports.WhiteRook = WhiteRook;
exports.WhiteQueen = WhiteQueen;
exports.WhiteHorse = WhiteHorse;