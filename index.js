const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
let app = express();
const path = require("path");
const http = require("http");
const sockitIO = require("socket.io");
const socketEvents = require("./server/utils/socketEvents");

//import routes
const users = require("./routes/users");
const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

//connect to MongoDB
const db = require('./config/keys').mongoLocal;
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => console.log("done"))
    .catch(err => {
        console.log(err);
    });


const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => socketEvents(io, socket));


app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.set("view engine","ejs");
app.set("views","./views");
app.use("/", users);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
});
