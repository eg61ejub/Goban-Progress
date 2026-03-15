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
