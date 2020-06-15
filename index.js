const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
let app = express();
const path = require("path");
const http = require("http");
const sockitIO = require("socket.io");
const socketEvents = require("./server/utils/socketEvents");
const keys = require('./config/keys');
//import routes
const users = require("./routes/users");
const home = require("./routes/home");
const message = require("./routes/message");
const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

//connect to MongoDB
mongoose.connect(keys.mongoLocal, {useNewUrlParser: true})
    .then(() => console.log("done"))
    .catch(err => {
        console.log(err);
    });


const server = http.createServer(app);
let io = sockitIO(server);
io.on("connection", (socket) => socketEvents(io, socket));

app.use(session({secret: keys.secretOrKey}));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");


app.use("/", users);
app.use("/home", home);
app.use("/message", message);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`)
});
