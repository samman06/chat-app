const express = require("express");
let app = express();
const path = require("path");
const http = require("http")
const sockitIO = require("socket.io")

const publicPath = path.join(__dirname, '/public')
app.use(express.static(publicPath));


const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => {
    console.log("new connection")
    socket.emit("newMessage", {
        from: "samman",
        text: "welcome to our chat app",
    })
    socket.broadcast.emit("newMessage", {
        from: "samman",
        text: "new user joined us",
        createdAt: new Date().getTime()
    })
    socket.on("createMessage", (message) => {
        io.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
})