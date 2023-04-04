// Constants to define the size of the game board.
const ROWS = 8;
const COLS = 8;
const MINES = 10;
const GameState = {
    Playing: 0,
    YouLost: 1,
    YouWin: 2
};

// A 2D array to represent the game board.
let board = [];

// A 2D array to represent the game board with fog of war.
let boardFog = [];

// Remaining spaces to reveal.
let spacesToReveal = ROWS * COLS - MINES;

// An array to keep track of the positions of mines on the board.
let mines = [];


// Initialize the game.
function initGame() {
    initBoards();
    addMines();
    calculateMinesAround();
}

// Initialize the board and the board with fog.
function initBoards() {
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        boardFog[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
            boardFog[row][col] = "#";
        }
    }
}

// Add the mines in the board randomly.
function addMines() {
    for (let i = 0; i < MINES; i++) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);

        if (board[row][col] !== "*") {
            board[row][col] = "*";
            mines.push([row, col]);
        } else {
            i--;
        }
    }
}

// Process a function for the cells around a specific cell.
function processCellsAround(row, col, processFunc) {
    for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
            processFunc(r, c);
        }
    }
}

// Populate the board with the number of mines around each cell.
function calculateMinesAround() {
    for (let i = 0; i < mines.length; i++) {
        const row = mines[i][0];
        const col = mines[i][1];

        processCellsAround(row, col, (r, c) => {
            if (board[r][c] !== "*") {
                board[r][c]++;
            }
        });
    }
}

// Display the board with the fog in the console.
function displayBoard() {
    displayBoardInternal(boardFog);
}

// Display a board in the console.
function displayBoardInternal(boardToDisplay) {
    console.log("  " + [...Array(COLS).keys()].join(" "));
    for (var row = 0; row < ROWS; row++) {
        console.log(row + " " + boardToDisplay[row].join(" "));
    }
}

// Updates the board revealing the cell and its possible cells around it.
function revealCell(row, col) {
    // Verifiy if the cell has a mine.
    if (board[row][col] === "*") {
        showCell(row, col);
        return GameState.YouLost;
    }

    revealCells(row, col);

    // Verify that there are no more spaces to reveal.
    if (spacesToReveal == 0) {
        return GameState.YouWin;
    }

    return GameState.Playing;
}

// Reveals a specific cell on the board.
function showCell(row, col) {
    boardFog[row][col] = board[row][col];
    spacesToReveal--;
}

// Reveals a specific cell and its possible cells around it.
function revealCells(row, col) {
    // Verify if the cell is already visible.
    if (boardFog[row][col] !== "#") {
        return;
    }
    showCell(row, col);
    // Verify if the cell contains a number (non-empty space).
    if (board[row][col] !== "*" && board[row][col] > 0) {
        return;
    }

    // Reveals the possible cells around the cell.
    processCellsAround(row, col, (r, c) => {
        revealCells(r, c);
    });
}

function redrawScreen() {
    console.clear();
    // displayBoardInternal(board);
    // console.log("");
    displayBoard();
    console.log("");
}

function displayPrompt() {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    const questionFunc = () => {
        rl.question("Row, Col: ", function (answer) {
            if (answer === "quit") {
                console.log("");
                return rl.close();
            }
    
            const values = answer.split(',')
            const row1 = parseInt(values[0]);  
            const col1 = parseInt(values[1]);  
            const result = revealCell(row1, col1)
            redrawScreen();
            if (result > 0) {
                if (result == GameState.YouLost) {
                    console.log("You lost");
                } else {
                    console.log("You win");
                }
                console.log();
                return rl.close();
            }
            
            questionFunc();
        });    
    }
    
    questionFunc();
}

function run() {
    initGame();
    redrawScreen();
    displayPrompt();
}


// Run the game.
run();

