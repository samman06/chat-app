const express = require("express");
let app = express();
const path = require("path");
const http = require("http");
const sockitIO = require("socket.io");
const {generateMessage} = require("./server/utils/message");
const users = require("./server/utils/users");

const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => {
    socket.on("join", ({name, room}, callback) => {
        let validationName = typeof name === "string" && name.trim().length > 3;
        let validationRoom = typeof room === "string" && room.trim().length > 3;
        if (!validationName || !validationRoom) {
            return callback("enter valid name and valid room");
        }

        socket.join(room);
        let user = {id: socket.id, name, room};
        users.addUser(user);
        io.to(room).emit("joinNewUser", users.getUserList(room));
        socket.emit("newMessage", generateMessage("Admin", "welcome to our chat app"));
        socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} Has Joined The Room`));
        callback()
    });

    socket.on("createMessage", ({from, text}) => {
        io.emit("newMessage", generateMessage(from, text))
    });
    socket.on("disconnect", () => {
        let user = users.removeUser(socket.id);
        io.to(user.room).emit("joinNewUser", users.getUserList(user.room));
        io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} Has Left The Room`));
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
})
