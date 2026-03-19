let socket = io()
let myName = null;
let myRole = null;
let gameState = null;

let canvas = document.getElementById("board")
let ctx = canvas.getContext("2d")

let size = 19
let grid = canvas.width / (size + 1)


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

  const pos = getBoardPosition(e);
  if (!pos) return;

  if (!myRole || myRole === "spectator") return;

  if (myRole !== gameState.currentTurn) {
    console.log("Nicht dein Zug");
    return;
  }

  const { x, y } = pos;

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

function drawStone(x, y, color) {

  let px = (x + 1) * grid
  let py = (y + 1) * grid

  ctx.beginPath()
  ctx.arc(px, py, grid * 0.4, 0, Math.PI * 2)

  ctx.fillStyle = color // <-- direkt verwenden

  ctx.fill()
  ctx.stroke()
}

function getBoardPosition(event) {

  let rect = canvas.getBoundingClientRect()

  let x = event.clientX - rect.left
  let y = event.clientY - rect.top

  let boardX = Math.round(x / grid) - 1
  let boardY = Math.round(y / grid) - 1

  if (boardX < 0 || boardX >= size) return null
  if (boardY < 0 || boardY >= size) return null

  return { x: boardX, y: boardY }
}

// --- -----------------------------
function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid neu zeichnen
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
}


