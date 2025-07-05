const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const modeRadios = document.querySelectorAll('input[name="mode"]');

let currentPlayer = "X";
let gameActive = true;
let cells = Array(9).fill("");
let gameMode = "player";

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Create board cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.addEventListener("click", handleCellClick);
  board.appendChild(cell);
}

modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    gameMode = document.querySelector('input[name="mode"]:checked').value;
    resetGame();
  });
});

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  makeMove(index, currentPlayer);

  const winPattern = getWinningPattern(currentPlayer);
  if (winPattern) {
    highlightWinningCells(winPattern);
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell !== "")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (gameMode === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  if (cell) cell.textContent = player;
}

function computerMove() {
  if (!gameActive) return;

  const emptyIndices = cells
    .map((val, i) => (val === "" ? i : null))
    .filter(i => i !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, "O");

  const winPattern = getWinningPattern("O");
  if (winPattern) {
    highlightWinningCells(winPattern);
    statusText.textContent = `Computer Wins!`;
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell !== "")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = `Player X's Turn`;
}

function getWinningPattern(player) {
  return winPatterns.find(pattern => {
    const [a, b, c] = pattern;
    return cells[a] === player && cells[b] === player && cells[c] === player;
  });
}

function highlightWinningCells(pattern) {
  pattern.forEach(index => {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) cell.classList.add("win");
  });
}

function resetGame() {
  cells.fill("");
  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
}

resetButton.addEventListener("click", resetGame);
