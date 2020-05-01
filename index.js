const express = require("express");
let app = express();
const path = require("path");
const http = require("http");
const sockitIO = require("socket.io");
const socketEvents = require("./server/utils/socketEvents");

const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => socketEvents(io,socket));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
});
