const express = require("express");
let app = express();
const path = require("path");
const http = require("http")
const sockitIO = require("socket.io")

const { generateMessage } = require("./server/utils/message")

const publicPath = path.join(__dirname, '/public')
app.use(express.static(publicPath));


const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => {
    console.log("new connection")
    socket.emit("newMessage", generateMessage("samman", "welcome to our chat app"))
    socket.broadcast.emit("newMessage", generateMessage("samman", "new user joined us"))
    socket.on("createMessage", ({ from, text }) => {
        io.emit("newMessage", generateMessage(from, text))
    })
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
})