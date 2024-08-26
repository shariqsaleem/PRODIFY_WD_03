const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const twoPlayerButton = document.getElementById('two-player');
const aiPlayerButton = document.getElementById('ai-player');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isAiMode = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Game mode selection
twoPlayerButton.addEventListener('click', () => {
    isAiMode = false;
    startGame();
});

aiPlayerButton.addEventListener('click', () => {
    isAiMode = true;
    startGame();
});

function startGame() {
    resetBoard();
    updateStatus(`Player ${currentPlayer}'s turn`);
    boardElement.style.pointerEvents = 'auto';
    restartButton.style.display = 'block';
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (board[index] !== '' || !isGameActive) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        highlightWinningCells();
        updateStatus(`Player ${currentPlayer} wins!`);
        isGameActive = false;
        boardElement.style.pointerEvents = 'none';
    } else if (checkDraw()) {
        boardElement.style.background = 'linear-gradient(120deg, #fceabb, #f8b500)'; // Yellow gradient for draw
        updateStatus("It's a draw!");
        isGameActive = false;
    } else {
        switchPlayer();
        if (isAiMode && currentPlayer === 'O') {
            setTimeout(aiMove, 500); // Slight delay for AI move
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
}

function checkWin() {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function updateStatus(message) {
    statusElement.textContent = message;
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '#f7f7f7';
    });
    boardElement.style.background = 'transparent';
    updateStatus('');
    boardElement.style.pointerEvents = 'auto';
}

function highlightWinningCells() {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });

    winningCombination.forEach(index => {
        cells[index].style.background = currentPlayer === 'X' 
            ? 'linear-gradient(120deg, #a8e063, #56ab2f)'  // Green gradient if Player X wins
            : 'linear-gradient(120deg, #ff4e50, #f9d423)';  // Red gradient if AI wins
    });
}

// AI Move (basic logic)
function aiMove() {
    const emptyCells = board
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';

    if (checkWin()) {
        highlightWinningCells();
        updateStatus(`Player O wins!`);
        isGameActive = false;
        boardElement.style.pointerEvents = 'none';
    } else if (checkDraw()) {
        boardElement.style.background = 'linear-gradient(120deg, #fceabb, #f8b500)'; // Yellow gradient for draw
        updateStatus("It's a draw!");
        isGameActive = false;
    } else {
        switchPlayer();
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

restartButton.addEventListener('click', resetBoard);
