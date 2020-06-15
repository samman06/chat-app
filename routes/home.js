const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");

// @route   GET login
// @desc    login users
// @access  public
router.get("/",
    async (req, res) => {
        const { _id, name, email} = req.session;
        const user = { _id, name, email};
        if(!email || !name) return res.redirect("/login");
        try {
            const users = await User.find({_id:{$nin:[_id]}});
            const messages = await Message.find({$or:[{from:_id,to:users[0]._id},{to:_id,from:users[0]._id}]})
                .populate('from', ['name']);
            res.render("home/chat", {user,users,messages});
        }catch (e) {
            return res.redirect("/login");
        }

});

router.post("/", async (req, res) => {
    const { _id, name, email} = req.session;
    const user = { _id, name, email};
    res.render("home/chat", {user});
});

module.exports = router;
