let socket = io();
socket.on("connect", () => {
    console.log("connected to server")
})

socket.on("newMessage", (message) => {
    console.log("this message from serve : ", message)
})