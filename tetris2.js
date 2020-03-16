const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const nextPieceElement = document.getElementById("nextPiece");
const contElementosElement = document.getElementById("contElementos");

//TODO: Crear objeto json de elemento  (nombre y simbolo)
//TODO: Crear arreglo de objetos elementos
//TODO: Crear arreglos de elementos por grupo
//TODO: Crear tarjetas de elementos
//TODO: validar mostrar tarjetas según puntaje

let currentLVL = 0;
let nxtLvl = currentLVL+1000;

const ROW = 17;
const COL = (COLUMN = 10);
const SQ = (squareSize = 25);
const VACANT = "WHITE"; // color of an empty square

const LVL0 = 0, LVL1 = 999, LVL2 = 1999, LVL3 = 2999, LVL4 = 3999, LVL5 = 4999, LVL6 = 5999,
      LVL7 = 6999, LVL8 = 7999, LVL9 = 8999, LVL10 = 9999, LVL11 = 1999, LVL12 = 11999, LVL13 = 12999;

// draw a square
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// create the board
let board = [];
for (r = 0; r < ROW; r++) {
  board[r] = [];
  for (c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

// draw the board
function drawBoard() {
  for (r = 0; r < ROW; r++) {
    for (c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();

// the pieces and their colors
const PIECES = [
  [Z, "#FF0D72"],
  [S, "#0DC2FF"],
  [T, "#0DFF72"],
  [O, "#F538FF"],
  [L, "#FF8E0D"],
  [I, "#FFE138"],
  [J, "#3877FF"]
];

// generate random pieces
function randomPiece() {
  let r = (randomN = Math.floor(Math.random() * PIECES.length)); // 0 -> 6
  return new Piece(PIECES[r][0], PIECES[r][1]);
}

var arregloPiezas = [];

function generarCargador(){
    for (let index = 0; index < 499; index++) {
      arregloPiezas.push(randomPiece());
    }
    //console.log(arregloPiezas);
}

generarCargador();


let p = randomPiece();

// The Object Piece
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0; // we start from the first pattern
  this.activeTetromino = this.tetromino[this.tetrominoN];

  // we need to control the pieces
  this.x = 3;
  this.y = -2;
}

// fill function
Piece.prototype.fill = function(color) {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      // we draw only occupied squares
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

// draw a piece to the board
Piece.prototype.draw = function() {
  this.fill(this.color);
};

// undraw a piece
Piece.prototype.unDraw = function() {
  this.fill(VACANT);
};

// move Down the piece
var cont = 0;
let nxtPieceToDraw = arregloPiezas[1];
console.log(arregloPiezas);

checkNextPiece();

console.log(nxtPieceToDraw);

Piece.prototype.moveDown = function() {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    // we lock the piece and generate a new one
    this.lock();
    p = randomPiece();
    cont++;
    let nextPieceCont = cont+1;
    nxtPieceToDraw = arregloPiezas[nextPieceCont];
    p = arregloPiezas[cont];
    //console.log(nxtPieceToDraw);
    //console.log(nxtPieceToDraw.color);
    checkNextPiece();

  }
};

function checkNextPiece(){
  if(nxtPieceToDraw.color == '#FF0D72'){
    console.log("Sigue Z");
    nextPieceElement.innerHTML = "<img src=\"./images/z.png\">";
  } else if (nxtPieceToDraw.color == '#0DC2FF'){
    console.log("Sigue S");
    nextPieceElement.innerHTML = "<img src=\"./images/s.png\">";
  } else if (nxtPieceToDraw.color == '#0DFF72'){
    console.log("Sigue T");
    nextPieceElement.innerHTML = "<img src=\"./images/t.png\">";
  } else if (nxtPieceToDraw.color == '#F538FF'){
    console.log("Sigue O");
    nextPieceElement.innerHTML = "<img src=\"./images/o.png\">";
  } else if (nxtPieceToDraw.color == '#FF8E0D'){
    console.log("Sigue L");
    nextPieceElement.innerHTML = "<img src=\"./images/l.png\">";
  } else if (nxtPieceToDraw.color == '#FFE138'){
    console.log("Sigue I");
    nextPieceElement.innerHTML = "<img src=\"./images/i.png\">";
  } else if (nxtPieceToDraw.color == '#3877FF'){
    console.log("Sigue J");
    nextPieceElement.innerHTML = "<img src=\"./images/j.png\">";
  }
}

// move Right the piece
Piece.prototype.moveRight = function() {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x++;
    this.draw();
  }
};

// move Left the piece
Piece.prototype.moveLeft = function() {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};

// rotate the piece
Piece.prototype.rotate = function() {
  let nextPattern = this.tetromino[
    (this.tetrominoN + 1) % this.tetromino.length
  ];
  let kick = 0;

  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COL / 2) {
      // it's the right wall
      kick = -1; // we need to move the piece to the left
    } else {
      // it's the left wall
      kick = 1; // we need to move the piece to the right
    }
  }

  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 => 1
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

let score = 0;
const alerChido = () =>
  Swal.fire({
    title: "Fin del juego!",
    text: "¿Terminar partida?",
    icon: "error",
    confirmButtonText: "¡Terminar!"
  }).then(function() {
    window.location =
      //"file:///Applications/MAMP/htdocs/SimpleTetris/index2.html";
      "file:///C:/wamp64/www/SimpleTetris/index2.html";
  });

Piece.prototype.lock = function() {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      // we skip the vacant squares
      if (!this.activeTetromino[r][c]) {
        continue;
      }
      // pieces to lock on top = game over
      if (this.y + r < 0) {
        //alert("Game Over");
        alerChido();
        // stop request animation frame
        gameOver = true;
        break;
      }
      // we lock the piece
      board[this.y + r][this.x + c] = this.color;
    }
  }
  // remove full rows
  for (r = 0; r < ROW; r++) {
    let isRowFull = true;
    for (c = 0; c < COL; c++) {
      isRowFull = isRowFull && board[r][c] != VACANT;
    }
    if (isRowFull) {
      // if the row is full
      // we move down all the rows above it

      for (y = r; y > 1; y--) {
        for (c = 0; c < COL; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      // the top row board[0][..] has no row above it
      for (c = 0; c < COL; c++) {
        board[0][c] = VACANT;
        //contR++;
      }

      // increment the score
      score += 250;

      scoreElement.innerHTML = score;
    }
  }
  // update the board
  drawBoard();
};

// collision fucntion
Piece.prototype.collision = function(x, y, piece) {
  for (r = 0; r < piece.length; r++) {
    for (c = 0; c < piece.length; c++) {
      // if the square is empty, we skip it
      if (!piece[r][c]) {
        continue;
      }
      // coordinates of the piece after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      // conditions
      if (newX < 0 || newX >= COL || newY >= ROW) {
        return true;
      }
      // skip newY < 0; board[-1] will crush our game
      if (newY < 0) {
        continue;
      }
      // check if there is a locked piece alrady in place
      if (board[newY][newX] != VACANT) {
        return true;
      }
    }
  }
  return false;
};

// CONTROL the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
  if (event.keyCode == 37 || event.keyCode == 65) {
    p.moveLeft();
    //dropStart = Date.now();
  } else if (
    event.keyCode == 38 ||
    event.keyCode == 81 ||
    event.keyCode == 69
  ) {
    p.rotate();
    //dropStart = Date.now();
  } else if (event.keyCode == 39 || event.keyCode == 68) {
    p.moveRight();
    //dropStart = Date.now();
  } else if (event.keyCode == 40 || event.keyCode == 83) {
    p.moveDown();
  }
}

// drop the piece every delta time
let dropStart = 0;
let gameOver = false;

function drop() {
  let now = Date.now();
  let delta = now - dropStart;

  //console.log(delta);

  if (score < LVL1) {
    if (delta > 650) {
      p.moveDown();
      dropStart = Date.now();
      // update the score
      levelElement.innerHTML = 0;
      currentLVL = 0;
      nxtLvl = LVL1;
    }
  }
  if (score >= LVL1 && score < LVL2) {
    if (delta > 550) {
      p.moveDown();
      dropStart = Date.now();
      // update the score
      levelElement.innerHTML = 1;
      currentLVL = 1;
      nxtLvl = LVL2;
    }
  } else if (score >= LVL2 && score < LVL3) {
    if (delta > 450) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 2;
      currentLVL = 2;
      nxtLvl = LVL3;
    }
  } else if (score >= LVL3 && score < LVL4) {
    if (delta > 425) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 3;
      currentLVL = 3;
      nxtLvl = LVL4;
    }
  } else if (score >= LVL4 && score < LVL5) {
    if (delta > 410) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 4;
      currentLVL = 4;
      nxtLvl = LVL5;
    }
  } else if (score >= LVL5 && score < LVL6) {
    if (delta > 400) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 5;
      currentLVL = 5;
      nxtLvl = LVL6;
    }
  } else if (score >= LVL6 && score < LVL7) {
    if (delta > 390) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 6;
      currentLVL = 6;
      nxtLvl = LVL7;
    }
  } else if (score >= LVL7 && score < LVL8) {
    if (delta > 380) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 7;
      currentLVL = 7;
      nxtLvl = LVL8;
    }
  } else if (score >= LVL8 && score < LVL9) {
    if (delta > 370) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 8;
      currentLVL = 8;
      nxtLvl = LVL9;
    }
  } else if (score >= LVL9 && score < LVL10) {
    if (delta > 360) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 9;
      currentLVL = 9;
      nxtLvl = LVL10;
    }
  } else if (score >= LVL10 && score < LVL11) {
    if (delta > 350) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 10;
      currentLVL = 10;
      nxtLvl = LVL11;
    }
  } else if (score >= LVL11 && score < LVL12) {
    if (delta > 340) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 11;
      currentLVL = 11;
      nxtLvl = LVL12;
    }
  } else if (score >= LVL12 && score < LVL13) {
    if (delta > 330) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 12;
      currentLVL = 12;
      nxtLvl = LVL13;
    }
  } else if (score >= LVL13) {
    if (delta > 320) {
      p.moveDown();
      dropStart = Date.now();
      levelElement.innerHTML = 13;
      currentLVL = 13;
    }
  }

  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}

drop();
