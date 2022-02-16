const socket = io('http://localhost:3000');

const CROSS_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const CELL_ARR = [];
const GRID = document.querySelectorAll('.subDiv');

let circleTurn;
let isOnTurn = true;
let winner;
let winningMessageTextElement = document.getElementById('win');

GRID.forEach((cell) => {
  CELL_ARR.push(cell);
  cell.addEventListener(
    'click',
    () => {
      const currentClass = circleTurn ? CIRCLE_CLASS : CROSS_CLASS;

      let a = CELL_ARR.indexOf(cell);
      socket.emit('place', a, currentClass, isOnTurn);

      placeMark(cell, currentClass);

      displayEnd();

      showTurn(isOnTurn);
    },
    { once: true }
  );
});

function endGame(draw, winner) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${winner} Wins!`;
  }
}

function displayEnd() {
  if (checkWin(CROSS_CLASS)) {
    winner = 'X';
    endGame(false, winner);
  } else if (checkWin(CIRCLE_CLASS)) {
    winner = 'Circle';
    endGame(false, winner);
  } else if (isDraw()) {
    endGame(true);
  }
}

function isDraw() {
  return [...GRID].every((cell) => {
    return cell.classList.contains(CROSS_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function showTurn(isOnTurn) {
  if (isOnTurn) {
    winningMessageTextElement.innerText = 'Enemy Turn!';
    isOnTurn = !isOnTurn;
  } else {
    winningMessageTextElement.innerText = 'Your Turn!';
    isOnTurn = !isOnTurn;
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return GRID[index].classList.contains(currentClass);
    });
  });
}

socket.on('showMessage', (isOnTurn) => {
  isOnTurn = !isOnTurn;
  showTurn(isOnTurn);
});

socket.on('placeMark', (cell, currentClass) => {
  placeMark(CELL_ARR[cell], currentClass);
  displayEnd();
});

socket.on('swap', () => {
  swapTurns();
  displayEnd();
});
