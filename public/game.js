const socket = io();

let myName = null;
let myRole = null;
let gameState = null;

// --- Spiel beitreten
function joinGame() {
  const input = document.getElementById("nameInput");
  myName = input.value;

  socket.emit("joinGame", myName);
}
// --- Init vom Server epmfangen
socket.on("init", (data) => {
  myRole = data.role;
  gameState = data.gameState;

  console.log("Ich bin:", myRole);

  drawBoard();
});

// --- Board zeichnen
function drawBoard() {
  clearBoard();

  gameState.board.forEach(stone => {
    drawStone(stone.x, stone.y, stone.color);
  });
}

// --- Zug an Server senden
canvas.addEventListener("click", (e) => {

  if (!myRole || myRole === "spectator") return;

  if (myRole !== gameState.currentTurn) {
    console.log("Nicht dein Zug");
    return;
  }

  const { x, y } = getBoardPosition(e);

  socket.emit("makeMove", {
    name: myName,
    x,
    y
  });
});

// --- Updates empfangen
socket.on("update", (newState) => {
  gameState = newState;
  drawBoard();
});

function resetGame() {
  socket.emit("resetGame");
}

// -----------------------



let socket = io()

let canvas = document.getElementById("board")
let ctx = canvas.getContext("2d")

let size = 19
let grid = canvas.width / (size + 1)

let player = 1
let board = []

for (let y = 0; y < size; y++) {

  board[y] = []

  for (let x = 0; x < size; x++) {
    board[y][x] = 0
  }

}

for (let i = 1; i <= size; i++) {

  ctx.beginPath()
  ctx.moveTo(grid, i * grid)
  ctx.lineTo(size * grid, i * grid)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(i * grid, grid)
  ctx.lineTo(i * grid, size * grid)
  ctx.stroke()

}

function drawStone(x, y, player) {

  let px = (x + 1) * grid
  let py = (y + 1) * grid

  ctx.beginPath()
  ctx.arc(px, py, grid * 0.4, 0, Math.PI * 2)

  ctx.fillStyle = player == 1 ? "black" : "white"

  ctx.fill()
  ctx.stroke()

}

canvas.onclick = function(event) {

  let rect = canvas.getBoundingClientRect()

  let x = event.clientX - rect.left
  let y = event.clientY - rect.top

  let boardX = Math.round(x / grid) - 1
  let boardY = Math.round(y / grid) - 1

  if (boardX < 0 || boardX >= size) return
  if (boardY < 0 || boardY >= size) return
  if (board[boardY][boardX] != 0) return

  board[boardY][boardX] = player

  drawStone(boardX, boardY, player)

  socket.emit("move", {
    x: boardX,
    y: boardY,
    player: player
  })

  player = 3 - player

}

socket.on("move", data => {

  if(board[data.y][data.x] != 0) return

  board[data.y][data.x] = data.player

  drawStone(data.x, data.y, data.player)

})

socket.on("reset", () => {

  location.reload()

})

socket.on("board", serverBoard => {

  for (let y = 0; y < size; y++) {

    for (let x = 0; x < size; x++) {

      if(serverBoard[y][x] != 0) {

        board[y][x] = serverBoard[y][x]

        drawStone(x, y, serverBoard[y][x])

      }

    }

  }

})

function newGame() {

  socket.emit("reset")

}
