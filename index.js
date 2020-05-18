const express = require("express");
const mongoose = require("mongoose");
let app = express();
const path = require("path");
const http = require("http");
const sockitIO = require("socket.io");
const socketEvents = require("./server/utils/socketEvents");

const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

const db = require('./config/keys').mongoLocal;
//connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("done"))
    .catch(err => {
        console.log(err);
    });

const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => socketEvents(io,socket));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
});
