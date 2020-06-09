const generateMessage = require("./message");
const User = require("../../models/User");

const socketEvents = (io, socket) => {
    socket.on("join", ({name, userId}) => {
        socket.join(userId);
        io.to(userId).emit("joinNewUser", {name, userId});
        socket.emit("newMessage", generateMessage("Admin", "welcome to sour chat app"));
        socket.broadcast.to(userId).emit("newMessage", generateMessage("Admin", `${name} Has Joined The Room`));
        // callback()
    });
    socket.on("createMessage", async ({message,userId,friendId}) => {
        let {name} = await User.findById(userId);
        io.to(friendId).emit("newMessage", generateMessage(name,userId, message));
        io.to(userId).emit("newMessage", generateMessage(name,userId, message))
    });
    // socket.on("disconnect", () => {
    //     let {name, room} = users.removeUser(socket.id);
    //     io.to(room).emit("joinNewUser", users.getUserList(room));
    //     io.to(room).emit("newMessage", generateMessage("Admin", `${name} Has Left The Room`));
    // });
};

module.exports = socketEvents;
