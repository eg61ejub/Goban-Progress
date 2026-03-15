const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

// --- Array für Spielstand-Speicherung
const size = 19

let board = []

for (let y = 0; y < size; y++) {

  board[y] = []

  for (let x = 0; x < size; x++) {
    board[y][x] = 0
  }

}


// --- Server connectet
io.on("connection", socket => {

  console.log("Player connected")

  socket.emit("board", board)

  socket.on("move", data => {

    board[data.y][data.x] = data.player

    io.emit("move", data)

  })

  socket.on("reset", () => {

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        board[y][x] = 0
      }
    }

    io.emit("reset")

  })

})


server.listen(3000, () => {
  console.log("Server running")
})
