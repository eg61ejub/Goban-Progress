const express = require("express")
const app = express()

const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static("public"))

io.on("connection", socket => {

  console.log("player connected")

  socket.on("move", data => {
    socket.broadcast.emit("move", data)
  })

})

const port = process.env.PORT || 3000

http.listen(port, () => {
  console.log("server running")
})
