// --- Array für Spielstand-Speicherung
const size = 19

let board = []

for (let y = 0; y < size; y++) {

  board[y] = []

  for (let x = 0; x < size; x++) {
    board[y][x] = 0
  }

}


// --- Server connecten
io.on("connection", socket => {

  console.log("Player connected")

  socket.on("move", data => {

    io.emit("move", data)

  })

})
