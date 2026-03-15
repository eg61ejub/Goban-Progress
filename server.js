io.on("connection", socket => {

  console.log("Player connected")

  socket.on("move", data => {

    io.emit("move", data)

  })

})
