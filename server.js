const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

// --- GameState 
let gameState = {
  players: [],        // ["Arisu", "Bob"]
  board: [],          // z.B. [{x:1, y:2, color:"black"}]
  currentTurn: "black"
};
// --- END GameState

// --- Alter Spielstand wird geladen 
const fs = require("fs");

if (fs.existsSync("gameState.json")) {
  const data = fs.readFileSync("gameState.json");
  gameState = JSON.parse(data);
}

// --- Speicher-Funktion
function saveGame() {
  fs.writeFileSync("gameState.json", JSON.stringify(gameState));
}

// --- Spieler verbinden sich
io.on("connection", (socket) => {

  // --- Spieler gibt sich Namen
  socket.on("joinGame", (name) => {

    if (gameState.players.length < 2 && !gameState.players.includes(name)) {
      gameState.players.push(name);
    }

    let role = "spectator";

    if (gameState.players[0] === name) role = "black";
    if (gameState.players[1] === name) role = "white";

    socket.emit("init", {
      role,
      gameState
    });
  });

  // --- Zug verarbeiten
  socket.on("makeMove", ({ name, x, y }) => {
  
    let color = null;
  
    if (gameState.players[0] === name) color = "black";
    if (gameState.players[1] === name) color = "white";
  
    if (color !== gameState.currentTurn) return;
  
    gameState.board.push({ x, y, color });
  
    gameState.currentTurn = color === "black" ? "white" : "black";
  
    saveGame();
  
    io.emit("update", gameState);
  });

  // --- Reset Game
  socket.on("resetGame", () => {

    gameState = {
      players: [],
      board: [],
      currentTurn: "black"
    };
    saveGame();
    io.emit("update", gameState);
  });

});

server.listen(3000, () => {
  console.log("Server running")
})

