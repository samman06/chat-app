const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require("../models/User");
const Message = require("../models/Message");
// @route   GET login
// @desc    login users
// @access  public
router.get("/",
    async (req, res) => {
        const { token} = req.session;
        try {
            let user = jwt.verify(token,keys.secretOrKey);
            const users = await User.find({_id:{$nin:[user._id]}});
            const messages = await Message.find({$or:[{from:user._id,to:users[0]._id},{to:user._id,from:users[0]._id}]})
                .populate('from', ['name']);
            res.render("home/chat", {user,users,messages});
        }catch (e) {
            return res.redirect("/login");
        }

});

router.post("/", async (req, res) => {
    const {user, token} = req.session;
    res.render("home/chat", {user, token});
});

module.exports = router;
