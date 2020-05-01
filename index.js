const express = require("express");
let app = express();
const path = require("path");
const http = require("http");
const sockitIO = require("socket.io");
const {generateMessage} = require("./server/utils/message");

const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => {
    socket.on("join", ({name, room}, callback) => {
        let validationName = typeof name === "string" && name.trim().length > 3;
        let validationRoom = typeof room === "string" && room.trim().length > 3;
        if (!validationName || !validationRoom) callback("enter valid name and valid room");
        socket.join(room);
        socket.emit("newMessage", generateMessage("Admin", "welcome to our chat app"));
        socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} joined us`));
        callback()
    });

    socket.on("createMessage", ({from, text}) => {
        io.emit("newMessage", generateMessage(from, text))
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
})
