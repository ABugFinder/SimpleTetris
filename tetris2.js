const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

const ROW = 17;
const COL = COLUMN = 10;
const SQ = squareSize = 25;
const VACANT = "WHITE"; // color of an empty square

// draw a square
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "GRAY";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// create the board
let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// the pieces and their colors
const PIECES = [
    [Z,"#FF0D72"],
    [S,"#0DC2FF"],
    [T,"#0DFF72"],
    [O,"#F538FF"],
    [L,"#FF8E0D"],
    [I,"#FFE138"],
    [J,"#3877FF"]
];

// generate random pieces
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

// The Object Piece
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 3;
    this.y = -2;
}

// fill function
Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

// draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color);
}

// undraw a piece
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

// move Down the piece
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;
const alerChido = () => Swal.fire({
    title: 'Fin del juego!',
    text: '¿Terminar partida?',
    icon: 'error',
    confirmButtonText: '¡Terminar!'
  }).then(function() {
    window.location = "file:///Applications/MAMP/htdocs/SimpleTetris/index2.html";
});

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                //alert("Game Over");
                alerChido();
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10 * 17;
            scoreElement.innerHTML = score;
        }
    }
    // update the board
    drawBoard();
    
    
}

// collision fucntion
Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece
document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37 || event.keyCode == 65){
        p.moveLeft();
        //dropStart = Date.now();
    }else if(event.keyCode == 38 || event.keyCode == 81 || event.keyCode == 69){
        p.rotate();
        //dropStart = Date.now();
    }else if(event.keyCode == 39 || event.keyCode == 68){
        p.moveRight();
        //dropStart = Date.now();
    }else if(event.keyCode == 40 || event.keyCode == 83){
        p.moveDown();
    }
}

// drop the piece every delta time
let dropStart = 0;
let gameOver = false;

function drop(){
    let now = Date.now();
    let delta = now - dropStart;

    console.log(delta);

    if (score < 200) {
        if(delta > 650){
            p.moveDown();
            dropStart = Date.now();
            // update the score
            levelElement.innerHTML = 1;
        }
    }
    if (score >= 200 && score < 1000) {
        if (delta > 350) {
            p.moveDown();
            dropStart = Date.now();
            // update the score
            levelElement.innerHTML = 2;
        }
    }
    if (score >= 1000 && score < 2000) {
        
        if (delta > 250) {
            p.moveDown();
            dropStart = Date.now();
            levelElement.innerHTML = 3;
        }
    }
    if (score >= 2000 && score < 3000) {
        
        if (delta > 200) {
            p.moveDown();
            dropStart = Date.now();
            levelElement.innerHTML = 4;
        }
    }
    if (score >= 3000 && score < 4000) {
        
        if (delta > 150) {
            p.moveDown();
            dropStart = Date.now();
            levelElement.innerHTML = 5;
        }
    }
    if (score >= 4000) {
        
        if (delta > 100) {
            p.moveDown();
            dropStart = Date.now();
            levelElement.innerHTML = 6;
        }
    }

    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();