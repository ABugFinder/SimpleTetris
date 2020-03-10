const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

createPiece();

function createPiece(){
    context.fillStyle = '#FF0D72';    

    context.fillRect(50, 50, 25, 25);
    context.fillRect(76, 50, 25, 25);
    context.fillRect(76, 76, 25, 25);
    context.fillRect(102, 50, 25, 25);
    
    /*
    context.fillStyle = 'black';
    context.font = "1px sans-serif";
    context.fillText(simbols[value], (x+.12) + offset.x, (y+.88) + offset.y);
    */


}

function createPiece() {
    piece.position = 0;
}

const piece = {
    position: null,
    simbol: null,
    score: null,
    matrix: null,
};

function playerDrop() {
    player.pos.y++;

    if (collide(arena, player)) {
        player.pos.y--;

        merge(arena, player);

        player.pos.y = 0;
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}


const tPiece = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ];

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];