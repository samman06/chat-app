const generateMessage = require("./message");
const users = require("./users");

const socketEvents = (io, socket) => {
    socket.on("join", ({name, room}, callback) => {
        let validateName = typeof name === "string" && name.trim().length > 3;
        let validateRoom = typeof room === "string" && room.trim().length > 3;
        if (!validateName || !validateRoom) {
            return callback("enter valid name and valid room and more than 3 characters");
        }

        socket.join(room);
        let user = {id: socket.id, name, room};
        users.addUser(user);
        io.to(room).emit("joinNewUser", users.getUserList(room));
        socket.emit("newMessage", generateMessage("Admin", "welcome to our chat app"));
        socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} Has Joined The Room`));
        callback()
    });
    socket.on("createMessage", (text) => {
        let {name, room} = users.getUser(socket.id);
        io.to(room).emit("newMessage", generateMessage(name, text))
    });
    socket.on("disconnect", () => {
        let {name, room} = users.removeUser(socket.id);
        io.to(room).emit("joinNewUser", users.getUserList(room));
        io.to(room).emit("newMessage", generateMessage("Admin", `${name} Has Left The Room`));
    });
};

module.exports = socketEvents;
